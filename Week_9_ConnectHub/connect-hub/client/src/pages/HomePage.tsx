import { useState } from 'react';
import { postService } from '@/services/post.service.ts';
import { Button } from '@/components/ui/button.tsx';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  Mail,
  Search,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { useAppState } from '@/store/useStore.ts';
import { Input } from '@/components/ui/input.tsx';
import { Field } from '@/components/ui/field.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import {
  socialAccountService,
} from '@/services/social-account.service.ts';
import { useQuery } from '@tanstack/react-query';

function HomePage() {
  const navigate = useNavigate();
  const { user, accessToken } = useAppState();
  const isAuthenticated = Boolean(accessToken && user);

  const { data: posts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await postService.fetchAllPosts();
      return res || [];
    },
  });

  const { data: activeRequestsToMe = [] } = useQuery({
    queryKey: ['socialAccountRequests'],
    queryFn: async () => {
      const res = await socialAccountService.fetchRequestToMe();
      return res || [];
    },
    enabled: isAuthenticated,
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(posts?.map((post) => post.category) || []));

  const handleSearch = () => {
    setActiveQuery(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredPosts = posts?.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    const matchesQuery = !activeQuery.trim() || activeQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .some((word) => post.title.toLowerCase().includes(word));

    return matchesCategory && matchesQuery;
  }) || [];

  if (isLoadingPosts) {
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
    <main data-layout="page-center-dynamic">
      <header data-layout="top-left-nav">
        <div
          data-layout="actions-cluster"
          className="flex flex-col md:flex-row items-start md:items-center gap-3"
        >
          <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft data-layout="icon-leading" />
            Back
          </Button>
          <div className="hidden md:flex gap-3">
            <Field orientation="horizontal" className="w-full gap-y-3">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full text-sm font-normal"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  if (!value.trim()) {
                    setActiveQuery('');
                  }
                }}
                onKeyDown={handleKeyDown}
              />
              <Button variant="secondary" onClick={handleSearch}>
                <Search />
              </Button>
            </Field>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all tags</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="flex md:hidden w-full pt-20 justify-center gap-3">
        <Field orientation="horizontal" className="w-full gap-y-3">
          <Input
            type="search"
            placeholder="Search..."
            className="w-full text-sm font-normal"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              if (!value.trim()) {
                setActiveQuery('');
              }
            }}
            onKeyDown={handleKeyDown}
          />
          <Button variant="secondary" onClick={handleSearch}>
            <Search />
          </Button>
        </Field>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all tags</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <header data-layout="top-right-nav">
        <div data-layout="actions-cluster">
          {!isAuthenticated ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          ) : (
            <>
              <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="relative">
                    <Mail className="h-4 w-4" />
                    {activeRequestsToMe.length > 0 && (
                      <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                  {activeRequestsToMe.length}
                </span>
                    )}
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Currents Requests</DialogTitle>
                    <DialogDescription>
                      Requests to get access to your social accounts data.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-3 py-4">
                    {activeRequestsToMe.length > 0 ? (
                      activeRequestsToMe.map((acc) => (
                        <div
                          key={acc.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{acc.client.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(acc.createdAt).toLocaleString('pl-PL', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}
                            </p>
                          </div>
                          <Link
                            to={`/profile/${acc.client.id}`}
                            className="inline-flex items-center gap-1 font-semibold hover:underline text-primary"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                            <span>Visit profile</span>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <span  className="text-sm text-muted-foreground text-center py-4">
                      You don't have any requests yet.
                    </span>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/create')}
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/profile/${user?.id}`)}
              >
                Profile
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="w-full max-w-xl md:pt-25 pt-0 pb-10">
        {filteredPosts?.length > 0 ? (
          <ul className="flex flex-col justify-center gap-10">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    <Link
                      to={`/profile/${post.user.id}`}
                      className="hover:underline hover:text-primary cursor-pointer transition-colors"
                    >
                      {post.user.username}
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent>{post.content}</CardContent>
                <CardContent>
                  <Badge variant="secondary">{post.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </ul>
        ) : (
          <Alert>
            <AlertCircle />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>No posts available.</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
}

export default HomePage