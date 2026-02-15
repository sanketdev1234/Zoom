import React, { useState } from 'react';
import axios from "axios";

export default function AddNewPost() {
  const [postData, setPostData] = useState({
    text: ''
  });

  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');

  const handleTextChange = (e) => {
    setPostData({
      text: e.target.value
    });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file))
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('text', postData.text);

      // Add media file if selected
      if (mediaFile) {
        formData.append('post_image', mediaFile);
      }

      // Replace with your actual API endpoint
      const response = await axios.post('/post/addnewpost',
        formData , {withCredentials:true});
      console.log(response);
      // Reset form after successful submission
      setPostData({ text: '' });
      setMediaFile(null);
      setMediaPreview('');
    } catch (error) {
      console.error('Error creating post:', error);
    } 
  };

  return (
    <div style={styles.container}>
      <div style={styles.postWrapper}>
        <h2 style={styles.title}>Create a New Post</h2>
         <form onSubmit={handleSubmit} enctype="multipart/form-data">
        <div style={styles.formSection}>
          <div style={styles.formGroup}>
            <label style={styles.label}>What's on your mind?</label>
            <textarea
              name="text"
              value={postData.text}
              onChange={handleTextChange}
              placeholder="Share your thoughts..."
              style={styles.textarea}
              rows="6"
            />
            <div style={styles.charCount}>
              {postData.text.length} characters
            </div>
          </div>
         
        {!mediaPreview && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Add Media (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaChange}
              style={styles.fileInput}
              name="post_image"
            />
           
            <p style={styles.helpText}>You can upload an image </p> 
          </div>
         )}
          {/* Media Preview */}
          {mediaPreview && (
            <div style={styles.mediaPreviewContainer}>
              <div style={styles.mediaPreviewHeader}>
                <span style={styles.previewLabel}>Preview:</span>
                <button
                  type="button"
                  onClick={removeMedia}
                  style={styles.removeMediaButton}
                >
                  Remove
                </button>
              </div>
              
               
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  style={styles.imagePreview}
                />
              
              
            </div>
          )}

          <button onClick={handleSubmit} style={styles.submitButton}> Create </button>
         
        </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  postWrapper: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '25px',
    color: '#333',
    textAlign: 'center'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    marginBottom: '10px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5'
  },
  charCount: {
    fontSize: '12px',
    color: '#999',
    marginTop: '5px',
    textAlign: 'right'
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#fafafa'
  },
  helpText: {
    fontSize: '12px',
    color: '#999',
    marginTop: '5px',
    marginBottom: 0
  },
  mediaPreviewContainer: {
    marginTop: '10px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    border: '1px solid #e0e0e0'
  },
  mediaPreviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  previewLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#555'
  },
  removeMediaButton: {
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  imagePreview: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '6px'
  },

  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#111212ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  }
};