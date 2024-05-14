import React, { useEffect, useState } from 'react';
import { Card, ListGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import { usePostId } from '../states';

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

    useEffect(() => {
        (async () => {
            if (postId === null) {
                return;
            }
    
            const res = await fetch(`/api/post/${postId}`);
            const resJson = await res.json();
            setPostData(resJson);
        })();
    }, [postId, topicRefreshCount]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const payload = {
            user: 'test-user',
            text: commentText,
            postId: postId
        };

        const response = await fetch(`/api/post/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.status !== 200) {
            console.log(`Failed to post comment: ${response.status}`);
        } else {
            setCommentText('');
            setTopicRefreshCount(prev => prev + 1);
        }
    };

    if (postId === null || postData === null) {
        return <>No Post to display</>;
    }

    const comments = postData['messages'];
    const firstComment = comments[0];
    if (firstComment === undefined) {
        return <>No Post to display</>;
    }
    const restOfComments = comments.slice(1);

    return (
        <Card style={{ height: '90vh' }}>
            <Card.Header>{postData.post.title}</Card.Header>
            <ListGroup variant="flush" style={{overflowY: 'auto', maxHeight: '80vh'}}>
                <Comment text={firstComment.text} isFirst={true} />
                {restOfComments.map((comment: any, index: number) => (
                    <Comment key={index} text={comment.text} isFirst={false} />
                ))}
            </ListGroup>
            <Card.Footer>
                <InputGroup>
                    <FormControl
                        placeholder="Add a comment..."
                        aria-label="Add a comment"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={(e) => handleSubmit(e)}>
                        Submit
                    </Button>
                </InputGroup>
            </Card.Footer>
        </Card>
    );
}
