import { useParams } from "react-router-dom";
import "./category.css";
import PostList from "../../components/posts/PostList";
import { posts } from "../../dummyData";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Category = () => {
  const dispatch = useDispatch();
  const { postsCount, posts } = useSelector(state => state.post);

  const { category } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="category">
      <h1 className="category-title">Posts based on {category}</h1>
      <PostList posts={posts} />
    </div>);
}

export default Category;