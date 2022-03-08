import Tweet from "components/Tweet";
import { dbService , storageService} from "fbase";
import {ref, uploadString} from "firebase/storage";
import {v4 as uuidv4} from 'uuid';
import { collection , addDoc, getDocs, onSnapshot, query} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({userObj})=>{
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [thumbnail, setThumbnail] = useState("");

    const getTweets = async()=>{
        const querySnapshot  = await getDocs(query(collection(dbService, "tweets")));
        querySnapshot.forEach((doc)=>{
            const tweetObj = {
                ...doc.data(),
                id: doc.id,
            }
            setTweets(prev =>[tweetObj, ...prev]);
        });
    }
    useEffect(()=>{
        getTweets();
        onSnapshot(query(collection(dbService,"tweets")), (querySnapshot)=>{
            const tweetArray = querySnapshot.docs.map(doc=>({
                id:doc.id,
                ...doc.data(),
            }))
            setTweets(tweetArray)
        })
    },[])
    const onSubmit = async (event)=>{
        event.preventDefault();
        const storageRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(storageRef, "data_url").then((snapshot)=>{
            console.log("Uploaded a blob or file!");
        });
        storageService.ref().child();
        // await addDoc(collection(dbService,"tweets"),{
        //     text: tweet,
        //     createdAt: Date.now(),
        //     creatorId: userObj.uid,
        // });
        setTweet("");
    };
    const onChanage = (event) => {
        const {target:{value}} = event;
        setTweet(value);
        
    };
    const onFileChange = (event)=>{
        const {target: {files},} = event;
        const newFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            onImageChange(finishedEvent);
        };
        reader.readAsDataURL(newFile);
    };
    const onImageChange = (event)=>{
        const {target:{result}} = event;
        setThumbnail(result);
    }
    const onClearPhotoClick = () => setThumbnail("");
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" value={tweet} onChange={onChanage} placeholder="What's on your mind?" maxLength={120}/>
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="tweet"/>
                {thumbnail && 
                <div>
                    <img src={thumbnail} width="50px" height="50px" onChange={onImageChange}/>
                    <button onClick={onClearPhotoClick}>Clear</button>
                </div>}
            </form>
            <div>
                {tweets.map((tweet)=>(
                    <Tweet 
                        key={tweet.id} 
                        tweetObj={tweet} 
                        isOwner={tweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
}
export default Home;