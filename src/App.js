import "./App.css";
import { useEffect, useState } from "react";
import api from './api/posts';
import { format } from "date-fns";
import { useMorph } from "react-morph";

const App = () => {

  const morph = useMorph();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [postEdit, setPostEdit] = useState(0);

  const editing = (id) => {
    setPage(3);
    setPostEdit(id);
  }

  useEffect(()=>{
    const fetchPosts = async () => {
      try{
        const res = await api.get('/posts');
        setPosts(res.data);
      } catch (err) {
        if(err.res) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else{
          console.log('Error:' `${err.message}`)
        }
      }
    }
    fetchPosts();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1 ;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody};
    try {
      const res = await api.post('/posts', newPost);
      const allPosts = [...posts, res.data];
      setPosts(allPosts);
      setPostTitle("");
      setPostBody("");
      setPage(1)
    } catch(err) {
      console.log(`Error: ${err.message}`)
    }
  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody};
    try{
      const res = await api.put(`posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id===id ? { ...res.data } : post));
      setEditTitle('');
      setEditBody('');
    }catch(err){
      console.log(`Error: ${err.message}`);
    }
  }

  const handleDelete = async (id) => {
    try{
      await api.delete(`posts/${id}`);
      setPosts(posts.filter(post=> post.id!==id))
    } catch (err){
      console.log(`Error: ${err.message}`);
    }
  }

  return <div className={`${page===1?"bg-sky-200 min-h-screen":"bg-sky-200 min-h-screen"} overflow-hidden`}>
    <div className="transition ease-in-out w-full h-max flex flex-col items-center justify-center pt-20 pb-20">
    <div {...morph} className="flex flex-row">
      <button onClick={()=>setPage(1)} className="transition ease-in-out font-bold hover:bg-sky-700 bg-sky-600 text-slate-100 text-center rounded-md text-3xl pt-5 pb-5 pl-10 pr-10 shadow-md shadow-slate-400 mr-3 active:bg-sky-800 font-mono">Home</button>
      <button onClick={()=>setPage(2)} className="transition ease-in-out font-bold hover:bg-sky-700 bg-sky-600 text-slate-100 text-center rounded-md text-3xl pt-5 pb-5 pl-10 pr-10 shadow-md shadow-slate-400 ml-3 active:bg-sky-800 font-mono">New Post</button>
    </div>
    <div {...morph} className="transition-all ease-in-out">
    {
      page===1 && <p {...morph} className="transition ease-in-out">{posts.map(p=> 
        <div className="m-5 bg-sky-50 pl-10 pr-10 pt-5 pb-5 rounded-md shadow-md flex flex-col items-center justify-center">
          <div className="justify-self-start">
            <h2 className="font-bold text-xl">{(p.title)}</h2>
            <h4 className="text-slate-500">{(p.datetime)}</h4>
            <p className="font-medium text-lg">{(p.body)}</p>
          </div>
          <div>
            <button onClick={()=>editing(p.id)} className="bg-sky-500 font-semibold pl-3 pr-3 pt-2 pb-2 w-24 mr-5 text-sky-100 rounded-md mt-2 shadow-md">Edit</button>
            <button onClick={()=>handleDelete(p.id)} className="bg-red-600 font-semibold pl-3 pr-3 pt-2 pb-2 w-24 text-sky-100 rounded-md mt-2 shadow-md">Delete</button>
          </div>
        </div>
      )}</p>
    }
    {
      page===2 && <div {...morph} className="w-11/12 m-5 bg-sky-50 pl-10 pr-10 pt-5 pb-5 rounded-md shadow-md flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
          <div>
            <h2 className="font-bold text-2xl">New Post</h2>
            <p className="font-semibold tex-lg mt-5">Title:</p>
            <input 
              type="text" 
              id="postTitle" 
              value={postTitle} 
              onChange={(e)=>setPostTitle(e.target.value)}
              className="pl-2 pr-2 pt-1 pb-1 w-60 border-none shadow-md shadow-slate-200 rounded-sm"
            />
            <p className="font-semibold tex-lg mt-3">Post:</p>
            <textarea
              id="postBody" 
              value={postBody} 
              onChange={(e)=>setPostBody(e.target.value)}
              className="pl-2 pr-2 pt-1 pb-1 w-60 border-none shadow-md shadow-slate-200 rounded-sm"
            /> <br/>
          </div>
          <button type="submit" className="bg-sky-500 font-semibold pl-3 pr-3 pt-2 pb-2 w-24 mr-5 text-sky-100 rounded-md mt-2 shadow-md">Add Post</button>
        </form>
      </div>
    }
    {
      page === 3 && <div {...morph} className="w-11/12 m-5 bg-sky-50 pl-10 pr-10 pt-5 pb-5 rounded-md shadow-md">
        <form onSubmit={()=>handleEdit(postEdit)} className="flex flex-col items-center justify-center">
          <div>
            <h2 className="font-bold text-2xl">Edit Post</h2>
            <p className="font-semibold tex-lg mt-5">Title:</p>
            <input 
              type="text" 
              id="postTitle" 
              defaultValue={posts[postEdit-1].title} 
              onChange={(e)=>setEditTitle(e.target.value)}
              className="pl-2 pr-2 pt-1 pb-1 w-60 border-none shadow-md shadow-slate-200 rounded-sm"
            />
            <p>Post:</p>
            <textarea 
              id="postBody" 
              defaultValue={posts[postEdit-1].body} 
              onChange={(e)=>setEditBody(e.target.value)}
              className="pl-2 pr-2 pt-1 pb-1 w-60 border-none shadow-md shadow-slate-200 rounded-sm"
            /> <br/>
          </div>
          <button type="submit" className="bg-sky-500 font-semibold pl-3 pr-3 pt-2 pb-2 w-24 mr-5 text-sky-100 rounded-md mt-2 shadow-md">Save</button>
        </form>
      </div>
    }
    </div>
  </div>
  </div>
};

export default App;
