import Tweet from "components/Tweet";
import { dbService } from "fbase";
import { collection , addDoc, getDocs, onSnapshot, query} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({userObj})=>{
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);

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
        await addDoc(collection(dbService,"tweets"),{
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setTweet("");
    };
    const onChanage = (event) => {
        const {target:{value}} = event;
        setTweet(value);
        
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" value={tweet} onChange={onChanage} placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="tweet"/>
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