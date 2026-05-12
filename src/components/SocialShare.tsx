import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  url: string;
  title: string;
  className?: string;
}

export default function SocialShare({ url, title, className = "" }: SocialShareProps) {
  const shareLinks = [
    {
      name: "Twitter",
      icon: <Twitter className="size-3.5" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-[#1DA1F2] hover:text-white"
    },
    {
      name: "Facebook",
      icon: <Facebook className="size-3.5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:bg-[#4267B2] hover:text-white"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="size-3.5" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:bg-[#0077b5] hover:text-white"
    }
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="icon"
          onClick={() => handleShare(link.url)}
          className={cn(
            "size-8 rounded-full bg-muted/30 text-muted-foreground transition-all duration-300",
            link.color
          )}
          title={`Share on ${link.name}`}
        >
          {link.icon}
          <span className="sr-only">Share on {link.name}</span>
        </Button>
      ))}
    </div>
  );
}
