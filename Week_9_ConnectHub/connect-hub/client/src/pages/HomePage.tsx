import { useEffect, useState } from 'react';
import { postService } from '@/services/post.service.ts';
import { Button } from '@/components/ui/button.tsx';
import { AlertCircle, ArrowLeft, Loader2, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { useAppDispatch, useAppState } from '@/store/useStore.ts';
import { Input } from '@/components/ui/input.tsx';
import { Field } from '@/components/ui/field.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';

function HomePage() {
  const navigate = useNavigate();

  const { user, posts, accessToken } = useAppState();
  const isAuthenticated = Boolean(accessToken && user);

  const hasPostsInStore = posts && posts.length > 0;
  const [loading, setLoading] = useState<boolean>(!hasPostsInStore);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(posts?.map((post) => post.category) || []));

  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;
    
    const fetchPosts = async () => {
      if (!hasPostsInStore) {
        setLoading(true);
      }

      try {
        const response = await postService.fetchAllPosts();

        if (isMounted) {
          dispatch({
            type: "SET_POSTS",
            payload: response,
          });
        }
      } catch (err: unknown) {
        console.error('Error during fetching posts:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };

  }, [dispatch]);

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

  if (loading && !hasPostsInStore) {
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
    <main data-layout="page-center-dymanic">
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