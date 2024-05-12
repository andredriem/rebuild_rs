import React from 'react';
import { Card, ListGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import { usePostId } from '../states';
import { LoremIpsum } from "lorem-ipsum";

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

    if (postId === null) {
        return <>No Post to display</>;
    }

    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 3,
            min: 2
        },
        wordsPerSentence: {
            max: 5,
            min: 3
        }
    });

    // Multiply postId to 10000 and cut the remaining decimals
    const title = `Post ${Math.floor(postId * 10000)}`;

    return (
        <Card style={{ height: '90vh' }}>
            <Card.Header>{title}</Card.Header>
            <ListGroup variant="flush" style={{overflowY: 'auto', maxHeight: '80vh'}}>
                <Comment text={lorem.generateParagraphs(4)} isFirst={true} />
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((comment, index) => (
                    <Comment key={index} text={lorem.generateParagraphs(1)} isFirst={false} />
                ))}
            </ListGroup>
            <Card.Footer >
                <InputGroup>
                    <FormControl
                        placeholder="Add a comment..."
                        aria-label="Add a comment"
                    />
                    <Button variant="outline-secondary" id="button-addon2">
                        Submit
                    </Button>
                </InputGroup>
            </Card.Footer>
        </Card>
    );
}
