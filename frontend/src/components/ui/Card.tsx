import React from 'react';
import DeleteIcon from "../icons/DeleteIcon";
import TwitterIcon from "../icons/TwitterIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import TweetEmbed from "./TweetEmbed";

interface CardProps {
  title: string;
  link: string;
  type: "youtube" | "tweet";
  deleteFn?: () => void;
}

const Card: React.FC<CardProps> = (props) => {
  const { title, link, type, deleteFn } = props;

  return (
    <div className="min-w-80 min-h-full rounded-lg bg-indigo-100 overflow-hidden shadow-md">
      <div className="py-3 bg-indigo-200 bg-opacity-50 flex gap-1 items-center justify-between px-3">
        <div className="flex gap-2 items-center">
          {type === "youtube" ? <YoutubeIcon /> : <TwitterIcon />}
          <h1 className="text-indigo-900 font-semibold text-md">{title}</h1>
        </div>
        <div className="flex gap-3 items-center text-indigo-700">
          <div 
            className="cursor-pointer hover:text-red-500 transition-all duration-200" 
            onClick={deleteFn}
          >
            {deleteFn && <DeleteIcon />}
          </div>
        </div>
      </div>
      <div className="w-full h-full p-3 bg-indigo-50">
        {type === "youtube" ? (
          <iframe
            className="rounded-lg w-full h-full"
            src={link || "N/A"}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : link ? (
          <TweetEmbed url={link} />
        ) : (
          <p className="text-indigo-800">Invalid Tweet ID</p>
        )}
      </div>
    </div>
  );
};

export default Card;