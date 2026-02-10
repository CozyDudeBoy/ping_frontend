import React from 'react';
import { Link } from 'react-router-dom';
const FeedbackCard = ({ data }) => {
  return (
    <Link to={`/detail/${data.id}`} className="feedback_card_link">
      <article className="feedback_card">
        <span className="badge">{data.mainType}</span>

        <h3 className="card-title">
          {data.description}
        </h3>

        <div className="bottom">
          <div className="pins">
            <img src={process.env.PUBLIC_URL + '/images/pin_icon.png'} alt="pin" />
            <span>핀 {data.pins}개</span>
          </div>

          <span className="date">{data.daysAgo}</span>
        </div>
      </article>
    </Link>
  );
};

export default FeedbackCard;