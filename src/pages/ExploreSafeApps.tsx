import { useState, useEffect } from "react";
import { Search, ArrowLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppCard } from "@/components/AppCard";
import { AppDetailModal } from "@/components/AppDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "All",
  "Payments",
  "Investments",
  "Savings",
  "Loans",
  "Insurance",
  "Budgeting",
  "Cryptocurrency",
  "Tax Filing",
  "Retirement Planning",
  "Personal Finance",
  "Wealth Management",
  "Fixed Deposits",
  "International Finance",
  "Others",
];

interface App {
  id: string;
  app_name: string;
  category: string;
  trust_score: number;
  developer: string;
  rbi_verified: boolean;
  permissions: string[];
  reason: string;
  icon_url: string | null;
  play_store_link: string | null;
}

const ExploreSafeApps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"trust_score" | "app_name">("trust_score");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    filterAndSortApps();
  }, [apps, searchQuery, selectedCategory, sortBy]);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('trust_score', { ascending: false });

      if (error) throw error;
      setApps(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch apps. Please try again.",
        variant: "destructive",
      });
      console.error('Error fetching apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApps = () => {
    let filtered = [...apps];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.app_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "trust_score") {
        return b.trust_score - a.trust_score;
      } else {
        return a.app_name.localeCompare(b.app_name);
      }
    });

    setFilteredApps(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-primary/10 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent truncate">
                Explore Safe Apps
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Discover trusted finance apps, verified by AI
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: "trust_score" | "app_name") => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trust_score">Trust Score</SelectItem>
                  <SelectItem value="app_name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            Showing {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
          </p>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading apps...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-base sm:text-lg">No apps found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onViewDetails={() => setSelectedApp(app)}
              />
            ))}
          </div>
        )}
      </div>

      {/* App Detail Modal */}
      <AppDetailModal
        app={selectedApp}
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      />
    </div>
  );
};

export default ExploreSafeApps;
