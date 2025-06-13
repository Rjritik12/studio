
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Inbox, MessageCircle, CreditCard, IndianRupee, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  // Mock conversations for UI demonstration
  const mockConversations = [
    { id: "1", username: "AliceWonder", lastMessage: "Sure, let's discuss the project.", unread: true, avatar: "https://placehold.co/40x40.png?text=AW" },
    { id: "2", username: "BobTheBuilder", lastMessage: "Can you send me the notes?", unread: false, avatar: "https://placehold.co/40x40.png?text=BB" },
    { id: "3", username: "CharlieCode", lastMessage: "Thanks for the help!", unread: false, avatar: "https://placehold.co/40x40.png?text=CC" },
  ];


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-10">
        <MessageCircle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Messages</h1>
        <p className="text-xl text-foreground/80 max-w-xl mx-auto">
          Your conversations with other EduVerse users.
        </p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-lg mb-8 border-accent">
        <CardHeader className="bg-accent/10">
          <CardTitle className="font-headline text-xl flex items-center text-accent">
            <CreditCard className="mr-3 h-6 w-6" /> Messaging Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-foreground/90 mb-2">
            Enjoy unlimited messaging <span className="font-semibold text-primary">free for your first month!</span>
          </p>
          <p className="text-foreground/90 mb-3">
            After your trial, unlock new conversations for just <IndianRupee className="inline h-4 w-4" />19 per person for one month of chat. 
            The person starting the chat pays, and the conversation is enabled for both users.
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Secure UPI payments will be supported.
          </p>
          <Button className="w-full opacity-70 cursor-not-allowed" disabled>
            Manage Subscription (Coming Soon)
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            (This is a prototype - no actual charges or payments are processed.)
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <Inbox className="mr-3 h-6 w-6 text-primary" /> Inbox
          </CardTitle>
          <CardDescription>
            Select a conversation to view messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockConversations.length > 0 ? (
            <ul className="space-y-3">
              {mockConversations.map((convo) => (
                <li key={convo.id}>
                  <Link href={`/messages/${encodeURIComponent(convo.username)}`} passHref>
                    <Button variant="ghost" className="w-full h-auto justify-start p-3 rounded-md hover:bg-muted/50">
                      <img src={convo.avatar} alt={convo.username} className="h-10 w-10 rounded-full mr-3" data-ai-hint="user avatar"/>
                      <div className="flex-1 text-left">
                        <p className={`font-semibold ${convo.unread ? 'text-primary' : 'text-foreground'}`}>{convo.username}</p>
                        <p className={`text-sm truncate ${convo.unread ? 'text-primary/80' : 'text-muted-foreground'}`}>{convo.lastMessage}</p>
                      </div>
                      {convo.unread && <span className="ml-2 h-3 w-3 rounded-full bg-primary"></span>}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Alert variant="default" className="bg-secondary/30">
              <Inbox className="h-5 w-5 text-secondary-foreground" />
              <AlertTitle className="font-semibold">No Conversations Yet</AlertTitle>
              <AlertDescription>
                Start messaging users from their profiles to see conversations here. Full messaging functionality is under development.
              </AlertDescription>
            </Alert>
          )}
           <Alert variant="default" className="mt-6 bg-primary/10 border-primary/30">
              <MessageCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="font-headline text-primary">Feature Under Development</AlertTitle>
              <AlertDescription className="text-foreground/80">
                This is a placeholder for the messaging inbox. Full real-time messaging capabilities are planned. The initial month of messaging is free. Afterwards, starting a new chat with a person will cost <IndianRupee className="inline h-3 w-3" />19 for one month of access with that specific user (one-time payment by initiator enables chat for both). The conversations listed are for demonstration.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
