
import Card from "../card/Card";
import "./list.scss";

function List({ posts, onDelete, onSave, savedPostIds = [] }) {
  return (
    <div className="list">
      {posts?.map((item) => (
        <Card
          key={item.id}
          item={item}
          onDelete={onDelete}
          onSave={onSave}
          isInitiallySaved={savedPostIds.includes(item.id)}
        />
      ))}
    </div>
  );
}

export default List;
