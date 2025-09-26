import React from "react";
import Message from "@/app/features/conversation/Message";

type User = {
    id: string;
    email: string;
    name: string;
    nickName?: string;
};

type MessageType = {
    id: string;
    text: string;
    createdAt: string;
    sender: User;
    recipient: User;
};

const messages: MessageType[] = [
    {
        id: "1",
        text: "Привіт! Як справи?",
        createdAt: "2024-06-01T10:00:00Z",
        sender: { id: "u1", email: "alice@email.com", name: "Alice" },
        recipient: { id: "u2", email: "bob@email.com", name: "Bob" },
    },
    {
        id: "2",
        text: "Все добре, дякую! А ти як?",
        createdAt: "2024-06-01T10:01:00Z",
        sender: { id: "u2", email: "bob@email.com", name: "Bob" },
        recipient: { id: "u1", email: "alice@email.com", name: "Alice" },
    },
    {
        id: "3",
        text: "Теж добре :)",
        createdAt: "2024-06-01T10:02:00Z",
        sender: { id: "u1", email: "alice@email.com", name: "Alice" },
        recipient: { id: "u2", email: "bob@email.com", name: "Bob" },
    },
];

const ConversationList: React.FC = () => (
    <>
        {messages.map((msg) => (
            <Message
                key={msg.id}
                text={msg.text}
                isMine={msg.sender.id === "u1"}
                createdAt={msg.createdAt}
            />
        ))}
    </>
);

export default ConversationList;

