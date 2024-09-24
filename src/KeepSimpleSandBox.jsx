import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SandBoxForMultimedia.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Paperclip, Lock, Send } from 'lucide-react';

const KeepSimpleSandBox = ({ window_title, flow_id, host_url, api_key }) => {
  const [chatOutput, setChatOutput] = useState('');
  const [reversedChatHistory, setReversedChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLocked, setIsLocked] = useState(false);  

  const fetchChatData = async () => {
    try {
      const response = await fetch(`${host_url}/api/v1/run/${flow_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': api_key,
        },
        body: JSON.stringify({
          input_type: 'chat',
          input_value: inputValue,  // Use the dynamic input value
          output_type: 'chat',
        }),
      });
  
      const data = await response.json();
      //console.log(data.outputs);
  
      if (data.outputs && data.outputs.length > 0) {
        const message = data.outputs[0].outputs[0].messages[0].message;
        //console.log('Extracted Message:', message);
  
        // Clear any previous chat history (if any) and set only the latest message
        setChatOutput(message);  // Set the message in the chat output state
        setReversedChatHistory([]);  // Clear chat history if needed
      } else {
        setChatOutput('No response found');  // Fallback if no message is found
        setReversedChatHistory([]);  // Clear chat history if no response
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
      setChatOutput('Error fetching data');  // Set error message if fetch fails
      setReversedChatHistory([]);  // Clear chat history in case of error
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLocked(true);
    setInputValue('');   // Prevent form submission refresh
    if (inputValue.trim()) { // Lock the input bar when a message is sent
      await fetchChatData();  // Call the fetch function on form submit
      setIsLocked(false);  // Unlock the input bar after data is fetched
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLocked) {
      handleSubmit(e);
    }
  };


  return (
    <div className="chat-widget p-4 bg-white border rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold mb-4 text-center">{window_title}</h3>
    <div className="flex justify-center">
    <div className="input-bar flex items-center border rounded-lg p-2 shadow-sm w-full max-w-4xl">
  <form onSubmit={handleSubmit} className="input-bar__form flex flex-grow items-center">
    <span className="input-bar__icon pr-2">
      <Paperclip size={20} className="text-gray-500" />
    </span>

    {/* Textarea with more width */}
    <textarea
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // Prevent default Enter behavior (new line)
          handleSubmit(e);    // Submit form on plain Enter
        }
      }}
      placeholder="Type your message..."
      rows={1} // Set initial rows
      style={{ lineHeight: '1.5rem' }} // Ensure the text area has line spacing
      className="input-bar__textarea w-full bg-transparent border-none focus:outline-none text-gray-700 px-2 resize-none overflow-auto max-h-24"
    />
    
    <button
      type="submit"
      className={`input-bar__button p-2 rounded-lg ${isLocked ? 'bg-gray-500' : 'bg-green-500'} text-white`}
      disabled={isLocked}  // Disable button when locked
    >
      {isLocked ? <Lock size={20} /> : <Send size={20} />}
    </button>
  </form>
</div>
  </div>
    <div className="main-card mb-4 p-4 rounded-lg">
      {(chatOutput || reversedChatHistory.length > 0) && (
        <div className={`chat-message ${!reversedChatHistory[0]?.isSend ? 'ai' : ''} mb-4`}>
          {!reversedChatHistory[0]?.isSend && (
            <div className="ai-section">
              <div className="ai-output prose max-w-none">
                <div className="letter">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {reversedChatHistory.length > 0 
                      ? (reversedChatHistory[0].message 
                        ? reversedChatHistory[0].message 
                        : chatOutput)
                      : (chatOutput 
                        ? chatOutput 
                        : 'No response found')}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
};

KeepSimpleSandBox.propTypes = {
  window_title: PropTypes.string.isRequired,
  flow_id: PropTypes.string.isRequired,
  host_url: PropTypes.string.isRequired,
  api_key: PropTypes.string.isRequired,
};

export default KeepSimpleSandBox