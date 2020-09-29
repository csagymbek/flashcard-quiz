import React, {useState, useEffect, useRef} from 'react';
import FlashcardList from "./components/FlashcardList";
import "./App.css";
import axios from "axios";

export default function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then(res => {
        setCategories(res.data.trivia_categories);
        // res.data.trivia_categories.forEach(category => console.log(category.name));
        
    });
  }, []);

  useEffect(() => {
   
  }, []);

  function decodeString(str){
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleSubmit(e){
    e.preventDefault();
    axios.get("https://opentdb.com/api.php", {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    }).then(res => {
      setFlashcards(res.data.results.map((questionItem, i) => {
        const answer = decodeString(questionItem.correct_answer);
        const options = [...questionItem.incorrect_answers.map(str => decodeString(str)), answer];
        return {
          id: `${i}-${Date.now()}`, 
          question: decodeString(questionItem.question),
          answer: answer,
          options: options.sort(() => Math.random() - .5)
        }
      }));
      });
  }

  return (
    <>
      <form action="" className="header" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select name="category" id="category" ref={categoryEl}>
              {categories.map(category => {
                return <option value={category.id} key={category.id}>{category.name}</option>
              })}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Number of questions</label>
            <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl}/>
          </div>
          <div className="form-group">
            <button className="btn">Generate</button>
          </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}