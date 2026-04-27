import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell } from "react-bootstrap-icons";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "pickup",
      title: "Pickup Schedule Approval",
      message: "Weekly pickup request for tomorrow at 10:00 AM",
      time: "5 min ago",
      read: false,
      actionable: true,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Approval Request",
      message: "Your payment of 450 ETB needs confirmation",
      time: "1 hour ago",
      read: false,
      actionable: true,
    },
    {
      id: 3,
      type: "otp",
      title: "OTP Sent",
      message: "A new OTP has been sent to your email.",
      time: "2 hours ago",
      read: true,
      actionable: false,
    },
  ]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/approve`, {
        method: "PUT",
      });
      markAsRead(id);
    } catch (err) {
      console.error("Approve failed", err);
      alert("Approve failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/reject`, {
        method: "PUT",
      });
      markAsRead(id);
    } catch (err) {
      console.error("Reject failed", err);
      alert("Reject failed");
    }
  };

  useEffect(() => {
    const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to notification backend via Socket.io");
    });

    newSocket.on("price-notification", (data) => {
      console.log("🔔 New price notification:", data);
      const newNotif = {
        id: data.id,
        type: "price",
        title: `Pickup Price: ${data.price} ETB`,
        message:
          data.message || `For ${data.kg}kg pickup (ID: ${data.pickupId})`,
        time: "Just now",
        read: false,
        actionable: true,
        kg: data.kg,
        price: data.price,
        pickupId: data.pickupId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });

    newSocket.on("notification-update", (updatedNotif) => {
      console.log("📱 Notification updated:", updatedNotif);
      setNotifications((prev) =>
        prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n)),
      );
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-success mb-1">
            <Bell className="me-2" /> Notifications
          </h1>
          <span className="badge bg-danger fs-6">{unreadCount} unread</span>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          {notifications.length === 0 ? (
            <div className="text-center py-5">
              <Bell size={64} className="text-muted mb-3" />
              <h5 className="text-muted">No notifications</h5>
              <p className="text-muted">Stay tuned for updates!</p>
            </div>
          ) : (
            <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`card mb-3 shadow-sm border-0 ${notif.read ? "bg-light" : "bg-white border-primary border-2"}`}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong className="h6 mb-0">{notif.title}</strong>
                      <small
                        className={`fw-medium ${notif.read ? "text-muted" : "text-primary"}`}
                      >
                        {notif.time}
                      </small>
                    </div>
                    <p className="text-muted mb-3">{notif.message}</p>
                    {notif.actionable && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm flex-grow-1"
                          onClick={() => handleApprove(notif.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm flex-grow-1"
                          onClick={() => handleReject(notif.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
