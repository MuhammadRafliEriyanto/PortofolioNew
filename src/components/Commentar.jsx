/* eslint-disable react/no-unknown-property */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
// eslint-disable-next-line no-unused-vars
import { createClient } from '@supabase/supabase-js';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';


// eslint-disable-next-line react/display-name, react/prop-types, no-unused-vars
const Comment = memo(({ comment, formatDate, index, isPinned = false }) => (
    <div 
        className={`px-4 pt-4 pb-2 rounded-xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${
            isPinned 
                ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:bg-gradient-to-r hover:from-primary/15 hover:to-accent/15' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 text-primary">
                <Pin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Pinned Comment</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            {comment.profile_image ? (
                <img
                    src={comment.profile_image}
                    alt={`${comment.user_name}'s profile`}
                    className={`w-10 h-10 rounded-full object-cover border-2 flex-shrink-0  ${
                        isPinned ? 'border-primary/50' : 'border-primary/30'
                    }`}
                    loading="lazy"
                />
            ) : (
                <div className={`p-2 rounded-full text-primary group-hover:bg-primary/30 transition-colors ${
                    isPinned ? 'bg-primary/30' : 'bg-primary/20'
                }`}>
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-medium truncate ${
                        isPinned ? 'text-primary/80' : 'text-white'
                        }`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                        <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary/80 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-slate-400/80 whitespace-nowrap">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="text-slate-300/80 text-sm break-words leading-relaxed relative bottom-2">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
));

// eslint-disable-next-line no-unused-vars
const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB. Please choose a smaller image.');
                // Reset the input
                if (e.target) e.target.value = '';
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                if (e.target) e.target.value = '';
                return;
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    Name <span className="text-accent">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                     maxLength={15}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    Message <span className="text-accent">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                     maxLength={200}

                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white">
                    Profile Photo <span className="text-slate-400/80">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-primary/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all border border-dashed border-primary/50 hover:border-primary group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-slate-400/80 text-sm mt-2">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-primary to-accent rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-soft-glow active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    // Fetch pinned comment
    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', true)
                    .single();
                
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching pinned comment:', error);
                    return;
                }
                
                if (data) {
                    setPinnedComment(data);
                }
            } catch (error) {
                console.error('Error fetching pinned comment:', error);
            }
        };

        fetchPinnedComment();
    }, []);

    // Fetch regular comments (excluding pinned) and set up real-time subscription
    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('portfolio_comments')
                .select('*')
                .eq('is_pinned', false)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error fetching comments:', error);
                return;
            }
            
            setComments(data || []);
        };

        fetchComments();

        // Set up real-time subscription
        const subscription = supabase
            .channel('portfolio_comments_channel')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'portfolio_comments'
                }, 
                () => {
                    fetchComments(); // Refresh comments when any change occurs
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        
        try {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-images')
                .upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.warn('Storage upload warning:', uploadError.message);
                return null;
            }

            const { data } = supabase.storage
                .from('profile-images')
                .getPublicUrl(fileName);

            return data?.publicUrl || null;
        } catch (err) {
            console.warn('Image upload skipped:', err);
            return null;
        }
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        
        try {
            const profileImageUrl = await uploadImage(imageFile);
            
            const { error } = await supabase
                .from('portfolio_comments')
                .insert([
                    {
                        content: newComment.trim(),
                        user_name: userName.trim(),
                        profile_image: profileImageUrl,
                        is_pinned: false,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                throw error;
            }

            // Immediately refresh list locally
            const { data } = await supabase
                .from('portfolio_comments')
                .select('*')
                .eq('is_pinned', false)
                .order('created_at', { ascending: false });
            if (data) setComments(data);
        } catch (error) {
            setError('Gagal mengirim komentar. Silakan coba lagi.');
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    // Calculate total comments (pinned + regular)
    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl  backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">
            <div className="p-6 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20">
                        <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                        Comments <span className="text-primary">({totalComments})</span>
                    </h3>
                </div>
            </div>
            <div className="p-6 space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-4 text-accent bg-accent/10 border border-accent/20 rounded-xl" data-aos="fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
                </div>

                <div className="space-y-4 h-[328px] overflow-y-auto overflow-x-hidden custom-scrollbar pt-1 pr-1 " data-aos="fade-up" data-aos-delay="200">
                    {/* Pinned Comment */}
                    {pinnedComment && (
                        <div data-aos="fade-down" data-aos-duration="800">
                            <Comment 
                                comment={pinnedComment} 
                                formatDate={formatDate}
                                index={0}
                                isPinned={true}
                            />
                        </div>
                    )}
                    
                    {/* Regular Comments */}
                    {comments.length === 0 && !pinnedComment ? (
                        <div className="text-center py-8" data-aos="fade-in">
                            <UserCircle2 className="w-12 h-12 text-primary mx-auto mb-3 opacity-50" />
                            <p className="text-slate-400/80">No comments yet. Start the conversation!</p>
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <Comment 
                                key={comment.id} 
                                comment={comment} 
                                formatDate={formatDate}
                                index={index + (pinnedComment ? 1 : 0)}
                                isPinned={false}
                            />
                        ))
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.5);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.7);
                }
            `}</style>
        </div>
    );
};

export default Komentar;