const Card = ({ thumbnail }) => {
    console.log("Thumbnail", thumbnail);
    return <img 
        className="card"
        src={thumbnail.url} 
        alt={thumbnail.title} 
    />;
};

export default Card;