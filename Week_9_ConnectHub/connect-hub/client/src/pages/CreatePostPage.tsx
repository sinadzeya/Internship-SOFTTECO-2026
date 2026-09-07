import { useAppState } from '@/store/useStore.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { AlertCircle, ArrowLeft} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import {
  type CreatePostDto,
  POST_CATEGORY_LABELS,
  PostCategory,
  postService,
} from '@/services/post.service.ts';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';

export function CreatePostPage(){
  const { user, accessToken } = useAppState();
  const isAuthenticated = Boolean(accessToken);

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePostDto>({
    title: "",
    content: "",
    category: PostCategory.DISCUSSION,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as PostCategory,
    }));
  };

  const handleCreatePost = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      await postService.create(formData);
      navigate('/home');
    } catch (err: unknown) {
      console.error('Error during creation:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  if (!isAuthenticated) {
    return null;
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


      {user ? (
        <div className="w-full max-w-xl pt-25 space-y-4">

          {error && (
            <Alert variant="destructive">
              <AlertCircle/>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Create</CardTitle>
              <CardDescription>
                Create a new post to start discussion with ConnectHub
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCreatePost} data-layout="stack-form">

                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="block text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="New post"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="content" className="block text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Hi everyone! I would like to talk about..."
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={6}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="category" className="block text-sm font-medium">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {Object.entries(PostCategory).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {POST_CATEGORY_LABELS[value] || value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Alert variant="destructive">
          <AlertCircle/>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load user data.</AlertDescription>
        </Alert>
      )}

    </main>
  );
}