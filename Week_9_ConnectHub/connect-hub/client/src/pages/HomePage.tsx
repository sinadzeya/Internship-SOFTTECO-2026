import { useEffect, useState } from 'react';
import { postService } from '@/services/post.service.ts';
import { Button } from '@/components/ui/button.tsx';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { useAppDispatch, useAppState } from '@/store/useStore.ts';

export function HomePage() {
  const navigate = useNavigate();

  const { posts } = useAppState();
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.fetchAllPosts();

        dispatch({
          type: "SET_POSTS",
          payload: response,
        });

      } catch (err: unknown) {
        console.error('Error during fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div data-layout="page-center">
      <Card data-layout="elements-full-width">
        <CardHeader>
          <CardTitle>ConnectHub</CardTitle>
          <CardDescription>Loading posts...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    </div>
    );
  }

  return (
    <main data-layout="page-center">
      <header data-layout="top-left-nav">
        <div data-layout="actions-cluster">
          <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft data-layout="icon-leading"/>
            Back
          </Button>
        </div>
      </header>
      <header data-layout="top-right-nav">
        <div data-layout="actions-cluster">
          <Button size="sm" variant="outline" onClick={() => navigate("/create")}>
            Create
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/profile")}>
            Profile
          </Button>
        </div>
      </header>

      <div className="w-full max-w-xl pt-25">
        {posts?.length > 0 ? (
          <ul className="flex flex-col gap-10">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    {post.user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {post.content}
                </CardContent>
                <CardContent>
                  <Badge variant="secondary">
                    {post.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          <Alert variant="destructive">
            <AlertCircle/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>No posts available.</AlertDescription>
          </Alert>
        )}
      </div>

    </main>

  );
}