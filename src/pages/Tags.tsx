import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '../components/Layout';
import { TagDialog } from '../components/TagDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useTags } from '../hooks/useTags';
import { useToast } from '@/hooks/use-toast';
import { Tag } from '../types';

export default function Tags() {
  const { tags, searchQuery, setSearchQuery, addTag, updateTag, deleteTag, usingMockData, error, isDeleting } = useTags();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; tag: Tag | null }>({ open: false, tag: null });

  const handleAddTag = async (tagData: Omit<Tag, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addTag(tagData);
      toast({
        title: 'Tag created',
        description: `"${tagData.name}" has been created successfully.`,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create tag. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsAddDialogOpen(true);
  };

  const handleUpdateTag = async (tagData: Omit<Tag, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingTag) return;
    
    try {
      await updateTag({ id: editingTag.id, updates: tagData });
      toast({
        title: 'Tag updated',
        description: `"${tagData.name}" has been updated successfully.`,
      });
      setIsAddDialogOpen(false);
      setEditingTag(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tag. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTag = async () => {
    if (!deleteConfirm.tag) return;
    
    try {
      await deleteTag(deleteConfirm.tag.id);
      toast({
        title: 'Tag deleted',
        description: `"${deleteConfirm.tag.name}" has been deleted successfully.`,
      });
      setDeleteConfirm({ open: false, tag: null });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tag. This tag may be in use by recipes.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tags</h1>
            <p className="text-muted-foreground">Manage recipe tags and categories</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Tag
          </Button>
        </div>

        {/* Mock Data Indicator */}
        {usingMockData && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <p className="text-sm text-amber-800">
                <strong>Demo Mode:</strong> Showing sample tags. 
                Connect to Supabase to see your real tags.
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && !usingMockData && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{tags.length}</div>
            <div className="text-sm text-muted-foreground">Total Tags</div>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {tags.filter(tag => tag.description).length}
            </div>
            <div className="text-sm text-muted-foreground">With Description</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <TagIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tags found</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords or create a new tag
                </p>
              )}
            </div>
          ) : (
            tags.map(tag => (
              <Card key={tag.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className="text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      </div>
                      {tag.description && (
                        <p className="text-sm text-muted-foreground">
                          {tag.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTag(tag)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm({ open: true, tag })}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Color: {tag.color}</span>
                    <span>ID: {tag.id}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Add/Edit Tag Dialog */}
        <TagDialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) setEditingTag(null);
          }}
          onSave={editingTag ? handleUpdateTag : handleAddTag}
          editingTag={editingTag}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={(open) => setDeleteConfirm({ open, tag: open ? deleteConfirm.tag : null })}
          title="Delete Tag"
          description={`Are you sure you want to delete "${deleteConfirm.tag?.name}"? This will remove it from all recipes that use this tag.`}
          onConfirm={handleDeleteTag}
          confirmText="Delete"
          variant="destructive"
        />
      </div>
    </Layout>
  );
}