"use client";

import { ICard, ICitation, IResponse } from "@/lib/api";
import { CARD_SHOW_PATH, getPageURL } from "@/lib/paths";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getThumbnail, getYouTubeEmbedUrl, isYouTubeURL } from "@/lib/utils";
import moment from "moment";
import { useEffect, useState } from "react";
import useClipboardApi from "use-clipboard-api";
import CardActions from "./CardActions";
import CardResponse from "./CardResponse";
import Citation from "./Citation";

type SupabaseRealtimePayload<T = any> = {
  old: T;
  new: T;
};

type Comment = {
  display_name: string;
  content: string;
  created_at: Date;
  card_id: string;
};

const BetaCard = ({ card }: { card: ICard }) => {
  const responses: IResponse[] = card.responses ?? [];
  const citations: ICitation[] = card.citations ?? [];
  const [value, copy] = useClipboardApi();
  const currentUrl = getPageURL(`${CARD_SHOW_PATH}/${card.id}`);
  const [recentlyCopied, setRecentlyCopied] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showCitations, setShowCitations] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const thumbnail = getThumbnail(citations);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("card_id", card.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setComments(data);
      } catch (error) {}
    };
    fetchComments();
  }, [card.id]);

  useEffect(() => {
    const channel = (supabase.channel(`cards:id=eq.${card.id}`) as any)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
        },
        (payload: SupabaseRealtimePayload<Comment>) => {
          if (payload.new.card_id === card.id) {
            setComments((prevComments) => [
              payload.new,
              ...(prevComments || []),
            ]);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      channel.unsubscribe();
    };
  }, [card.id]);

  return (
    <div className="w-full text-primary">
      {/* Card Header */}
      <div className="mb-4 space-y-2">
        <h1 className="text-2xl">{card.title}</h1>
        <h1 className="text-sm text-secondary">
          {moment.utc(card.created_at!).local().fromNow()}
        </h1>
      </div>

      {/* Card Responses */}
      {responses.map((response, index) => (
        <CardResponse response={response} key={index} />
      ))}

      <div>
        {isYouTubeURL(thumbnail?.source_url) && (
          <iframe
            id="ytplayer"
            src={getYouTubeEmbedUrl(thumbnail?.source_url)}
            frameBorder="0"
            className="h-64 w-full lg:h-96"
          ></iframe>
        )}
      </div>

      <CardActions card={card} />

      {/* Citations Section */}
      <div className="mb-6 mt-4">
        <button
          className="bg-brighter-blue hover:bg-even-brighter-blue focus:shadow-outline w-full cursor-pointer rounded-md bg-secondary px-4 py-2 font-bold text-primary focus:outline-none"
          aria-label={showCitations ? "Hide Citations" : `Show all citations`}
          onClick={() => setShowCitations((prev) => !prev)}
        >
          {showCitations ? "Hide Citations" : `Show all citations`}
        </button>

        {showCitations && (
          <div className="mt-6 flex flex-row flex-wrap text-sm">
            {citations.map((citation, index) => (
              <Citation citation={citation} index={index} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BetaCard;
