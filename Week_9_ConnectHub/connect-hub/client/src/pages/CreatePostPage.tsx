import { useAppState } from '@/store/useStore.ts';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BackButtonHeader } from '@/components/custom/BackButtonHeader.tsx';
import { StatusAlert } from '@/components/custom/StatusAlert.tsx';

export function CreatePostPage(){
  const { user } = useAppState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreatePostDto>({
    title: "",
    content: "",
    category: PostCategory.DISCUSSION,
  });

  const createPostMutation = useMutation({
    mutationFn: (newPost: CreatePostDto) => postService.create(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/home');
    },
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
    createPostMutation.mutate(formData);
  };

  return (
    <main data-layout="page-center-dynamic">
      <BackButtonHeader />

      {user ? (
        <div className="w-full max-w-xl pt-20 space-y-4">

          {createPostMutation.isError && (
            <StatusAlert
              variant="destructive"
              title="Error"
              description="Failed to create post. Please try again."
            />
          )}

          <Card className="shadow-md space-y-4">
            <CardHeader>
              <CardTitle data-style="text-accent">Create</CardTitle>
              <CardDescription>
                Create a new post to start discussion with ConnectHub
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCreatePost} data-layout="stack-form">

                <div className="flex flex-col gap-2">
                  <label htmlFor="title"
                         className="block text-sm font-medium"
                         data-style="text-accent"
                  >
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
                  <label htmlFor="content"
                         className="block text-sm font-medium"
                         data-style="text-accent"
                  >
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

                <div className="flex flex-col gap-2 pb-4">
                  <label htmlFor="category"
                         className="block text-sm font-medium"
                         data-style="text-accent"
                  >
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

                <Button data-style="button-slightly-accent" type="submit" disabled={createPostMutation.isPending}>
                  {createPostMutation.isPending ? (
                    <>
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <StatusAlert
          variant="destructive"
          title="Error"
          description="Failed to load user data."
        />
      )}

    </main>
  );
}