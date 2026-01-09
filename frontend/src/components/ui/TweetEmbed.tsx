import { useEffect } from "react";

const TweetEmbed = (props: { url: string }) => {
  useEffect(() => {
    // Load the Twitter script dynamically if it's not already loaded
    const scriptId = "twitter-wjs";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If script is already loaded, refresh widgets
      //@ts-ignore
      window.twttr?.widgets.load();
    }
  }, []);

  return (
    <blockquote className="twitter-tweet">
      <a href={props.url}></a>
    </blockquote>
  );
};

export default TweetEmbed;
