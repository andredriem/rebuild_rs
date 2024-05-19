import React, { ReactElement, useEffect, useState } from 'react';
import { Card, ListGroup, InputGroup, FormControl, Button, Alert, Container, Row } from 'react-bootstrap';
import { showMobile, useLoginData, useOpenTopic, usePostId, useShowLoginModal } from '../states';

function Comment({ text, isFirst }: { text: string; isFirst: boolean }) {
  const style = isFirst ? {} : { backgroundColor: '#f8f9fa', fontStyle: 'italic' };
  return (
    <ListGroup.Item style={style}>
      {text}
    </ListGroup.Item>
  );
}

export function Topic() {
  const { postId } = usePostId();
  const [postData, setPostData] = useState<any>(null);
  const [topicRefreshCount, setTopicRefreshCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [iframeWait, setIframeWait] = useState(true);
  const { loginData, setLoginData } = useLoginData()
  const { setShowLoginModal } = useShowLoginModal()
  const { setOpenTopic, openTopic } = useOpenTopic();

  let commentNumberOfRows = 5;
  if (showMobile) {
    commentNumberOfRows = 3;
  }

  useEffect(() => {
    // Creates a timeout of 1 second to wait for the iframe to load
    // to esnure that the topic is correctly loaded
    const timeout = setTimeout(() => {
      setIframeWait(false);
    }, 1000);
    setIframeWait(true);
    return () => clearTimeout(timeout);
  }, [postId]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const payload = {
      raw: commentText,
      topic_id: postId
    };

    const response = await fetch(`/forum/posts.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 422) {
      try {
        const errorData = await response.json();
        setErrors(errorData.errors || ['An unknown error occurred.']);
      } catch (error) {
        setErrors(['Failed to parse error message.']);
      }
      // 422 is unauthorized, so we must logout the user
    } else if (response.ok) {
      setCommentText('');
      setErrors([]); // Clear errors on successful post
      setTopicRefreshCount(prev => prev + 1);
    } else if (response.status === 401 || response.status === 403) {
      setErrors(['You must be logged in to post a comment.']);
      setLoginData(null);
    }
    else {
      console.log(`Failed to post comment: ${response.status}`);
    }


  };

  if (postId === null) {
    return <>No Post to display</>;
  }

  let footer: ReactElement | null = null
  if (loginData !== null) {
    footer = <>
      <div style={{ height: '15vh' }}>
        {errors.length > 0 && <Alert variant="danger">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>}
        <InputGroup>
          <FormControl
            as="textarea"
            placeholder="Add a comment..."
            aria-label="Add a comment"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            rows={commentNumberOfRows}
          />
          <Button variant="outline-secondary" id="button-addon2" onClick={(e) => handleSubmit(e)}>
            Submit
          </Button>
        </InputGroup>
      </div>
    </>
  } else {
    // Message saying that the user is not logged in
    // and a button to open the login modal
    footer = <>
      <Button onClick={() => setShowLoginModal(true)}>Fazer login para comentar</Button>
    </>
  }

  let closeLoginMobile;
  if (showMobile) {
    closeLoginMobile = (
      <Button onClick={() => setOpenTopic(false)}>Fechar</Button>
    )
  }

  let cardTaskName = '';
  if (showMobile) {
    cardTaskName = 'mt-4';
  }

  return (
    <Card className={cardTaskName}>
      <Container>
        <Row>{closeLoginMobile}</Row>
        <Row>
          {
            (() => {
              if (iframeWait) {
                return <Card.Body>Loading...</Card.Body>
              }
              return <iframe key={topicRefreshCount} title={'aaa' + topicRefreshCount.toString()} src={`/forum/embed/comments?topic_id=${postId}`} style={{ width: '100%', border: 'none', height: '75vh' }}></iframe>
            })()
          }
        </Row>
        <Card.Footer>
          {footer}
        </Card.Footer>
      </Container>
    </Card>
  );
}
