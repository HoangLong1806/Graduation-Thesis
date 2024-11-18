import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // Sử dụng useNavigate
  useEffect(() => {
    // Khởi tạo slide tự động khi allEvents tồn tại
    if (allEvents && allEvents.length > 0) {
      setCurrentEvent(allEvents[0]); // Hiển thị sự kiện đầu tiên
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % allEvents.length);
      }, 3000); // Cứ 3 giây thay đổi sự kiện

      return () => clearInterval(interval); // Dọn dẹp khi component bị unmount
    }
  }, [allEvents]);

  // Cập nhật sự kiện hiện tại khi chỉ số thay đổi
  useEffect(() => {
    if (allEvents && allEvents.length > 0) {
      setCurrentEvent(allEvents[currentIndex]);
    }
  }, [currentIndex, allEvents]);
  const handleEventClick = () => {
    navigate('/events'); // Chuyển hướng đến trang /events
  };

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          <div className="w-full grid" onClick={handleEventClick}>
            {currentEvent ? (
              <EventCard data={currentEvent} />
            ) : (
              <p className="text-center">No events available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
