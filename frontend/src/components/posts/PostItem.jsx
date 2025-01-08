import { Link } from "react-router-dom";

const PostItem = ({ post }) => {
    return (
        <div className="post-item">
            <div className="post-item-image-wrapper">
                <img src={post?.image.url} alt="" className="post-item-image" />
            </div>
            <div className="post-item-info-wrapper">
                <div className="post-item-info">
                    <div className="post-item-author">
                        <strong>Author: </strong>
                        <Link
                        className="post-item-username"
                        to={`/profile/${post?.user?._id}`}>
                            {post?.user.username}
                        </Link>
                    </div>
                    <div className="post-item-date">
                        {new Date(post?.createdAt).toDateString()}
                    </div>
                </div>
                <div className="post-item-details">
                    <h4 className="post-item-title">{post?.title}</h4>
                    <Link classname="post-item-category" to={`/posts/categories/${post?.category}`}>
                        {post?.category}
                    </Link>
                </div>
                <p className="post-item-description">
                    {post?.description}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sapiente animi neque aliquid nam totam deserunt ab blanditiis hic explicabo dicta harum cumque,
                    quis enim aut a cum alias incidunt nisi?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sapiente animi neque aliquid nam totam deserunt ab blanditiis hic explicabo dicta harum cumque,
                    quis enim aut a cum alias incidunt nisi?
                </p>
                <Link className="post-item-link" to={`/posts/details${post?._id}`}>
                    Read More...
                </Link>
            </div>
        </div>
    );
}

export default PostItem;