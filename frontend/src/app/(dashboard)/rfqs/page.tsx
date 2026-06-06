"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, Search, Filter, MoreHorizontal, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const response = await api.get("/rfqs/");
        const formattedRfqs = response.data.map((rfq: any) => ({
          ...rfq,
          responses_count: 0 // Will implement later with actual quotes
        }));
        setRfqs(formattedRfqs);
      } catch (error) {
        console.error("Failed to fetch RFQs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRfqs();
  }, []);

  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesSearch = 
      rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.rfq_number.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published': return 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20';
      case 'draft': return 'bg-muted text-muted-foreground border border-border';
      case 'closed': return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-border shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Requests for Quotation</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage procurement requests and track vendor responses.</p>
          </div>
        </div>
        
        <Link
          href="/rfqs/create"
          className="flex items-center px-4 py-2.5 rounded-lg font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
        >
          <Plus className="w-5 h-5 mr-1.5" /> Create RFQ
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search RFQs by title or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="h-4 w-4 text-muted-foreground mr-2" />
          {["all", "published", "draft", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 text-sm rounded-full capitalize transition-all duration-200 whitespace-nowrap ${
                statusFilter === status 
                  ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* RFQ Grid */}
      {loading ? (
        <div className="flex justify-center items-center p-24 glass-panel rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary"></div>
            <p className="text-muted-foreground font-medium animate-pulse">Loading RFQs...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRfqs.length > 0 ? (
              filteredRfqs.map((rfq, index) => (
                <motion.div
                  key={rfq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel rounded-xl overflow-hidden group hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(rfq.status)}`}>
                        {rfq.status.toUpperCase()}
                      </span>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1" title={rfq.title}>
                      {rfq.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 font-mono bg-secondary/50 inline-block px-2 py-0.5 rounded">
                      {rfq.rfq_number}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                        <span>Created: <span className="text-foreground font-medium">{formatDate(rfq.created_at)}</span></span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-rose-500/70" />
                        <span>Deadline: <span className="text-foreground font-medium">{formatDate(rfq.deadline)}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, rfq.responses_count || 1))].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary">
                              V
                            </div>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground ml-2">
                          {rfq.responses_count} Quotes
                        </span>
                      </div>
                      
                      <Link 
                        href={`/rfqs/${rfq.id}`}
                        className="flex items-center text-sm font-semibold text-primary hover:text-primary/80 group-hover:translate-x-1 transition-all"
                      >
                        View <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center glass-panel rounded-2xl">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-base font-medium text-muted-foreground">No RFQs found matching your criteria.</p>
                <Link href="/rfqs/create" className="text-primary hover:underline mt-2 inline-block">
                  Create your first RFQ
                </Link>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
