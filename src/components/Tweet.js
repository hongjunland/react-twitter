import { dbService ,storageService} from "fbase";
import { deleteDoc, doc ,updateDoc} from "firebase/firestore";
import {ref, deleteObject} from "firebase/storage";
import React, { useState } from "react";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [attachmentUrl, setAttachmentUrl] = useState(tweetObj.attachmentUrl);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    if (ok) {
      await deleteDoc(doc(dbService, `tweets/${tweetObj.id}`));
      const desertRef = ref(storageService, attachmentUrl);
      deleteObject(desertRef).then(()=>console.log("성공")).catch((err)=>console.log("실패"));
    }
  };
  const toggleEditting = () => {
    setEditing((prev) => !prev);
  };
  const onChanage = (event) =>{
    const {
        target: { value },
    } = event;
    setNewTweet(value)
  }
  const onSubmit = async(event)=>{
    event.preventDefault();
    console.log(tweetObj, newTweet);
    await updateDoc(doc(dbService, `tweets/${tweetObj.id}`), {
        text: newTweet
    });
    toggleEditting()
  }
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
                text="text"
                placeholder="Edit your tweet"
                value={newTweet} 
                onChange={onChanage}
                required />
            <input
                type="submit"
                value="edit"
            />
          </form>
          <button onClick={toggleEditting}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {attachmentUrl && <img src={attachmentUrl} width="50px" height="50px" /> }
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Tweet</button>
              <button onClick={toggleEditting}>Edit Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
