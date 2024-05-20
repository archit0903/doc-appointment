import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const Notification = ({ patientName }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/${patientName}`);
      if (response.status === 200) {
        const data = response.data;
        setNotifications(data.notifications);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeNotification = async (notificationText) => {
    
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${patientName}/${notificationText}`);
      // Update the state to remove the deleted notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.text !== notificationText)
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };
  

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h3>Notifications</h3>
            </Card.Header>
            <Card.Body>
              <ul className="list-group">
                {notifications.map((notification) => (
                  <li key={notification.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {notification.notification}
                    (sent by - Dr.{notification.doctorName})
                    <Button
                      variant="danger"
                      onClick={() => removeNotification(notification.notification)}
                    >
                      &#10005;
                    </Button>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Notification;
