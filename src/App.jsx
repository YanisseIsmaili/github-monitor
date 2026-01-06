import React, { useState, useEffect } from 'react';
import { RefreshCw, GitBranch, Calendar, User, ExternalLink, Github, GripVertical, Search, X, ChevronDown, ChevronUp, Palette, BarChart3, Grid3x3, TrendingUp, Award, Clock, AlertCircle, Tag, Filter } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRepoCard({ repo, formatDate, isCollapsed, onToggleCollapse, colorClasses, showColorPicker, onToggleColorPicker, availableColors, onSetColor, tags, showTagPicker, onToggleTagPicker, availableTags, onToggleTag }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: repo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${colorClasses.bg} rounded-lg shadow-xl border-2 ${colorClasses.border} overflow-hidden ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Repo Header */}
      <div className="p-4 bg-gray-750 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing mt-1 text-gray-500 hover:text-gray-300"
            >
              <GripVertical size={20} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  {repo.name}
                  <ExternalLink size={16} />
                </a>
                {repo.access_type === 'collaborator' && (
                  <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded border border-green-700">
                    Invité
                  </span>
                )}
                {/* Affichage des tags */}
                {tags.map(tag => (
                  <span key={tag.id} className={`px-2 py-0.5 ${tag.color} ${tag.textColor} text-xs rounded font-medium`}>
                    {tag.name}
                  </span>
                ))}
              </div>
              {!isCollapsed && repo.description && (
                <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Bouton de tags */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTagPicker(repo.id);
                }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Ajouter des tags"
              >
                <Tag size={20} />
              </button>
              
              {/* Tag Picker Dropdown */}
              {showTagPicker === repo.id && (
                <div className="absolute right-0 top-full mt-2 z-50 bg-gray-750 border border-gray-600 rounded-lg shadow-xl p-2 min-w-[140px]">
                  <div className="text-xs text-gray-400 mb-2 px-2">Tags</div>
                  {availableTags.map((tag) => {
                    const isActive = tags.some(t => t.id === tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => onToggleTag(repo.id, tag.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                          isActive ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          isActive ? tag.color : 'border-gray-600'
                        }`}>
                          {isActive && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                        </div>
                        <span className="text-sm text-gray-200">{tag.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bouton de couleur */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleColorPicker(repo.id);
                }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Changer la couleur"
              >
                <Palette size={20} />
              </button>
              
              {/* Color Picker Dropdown */}
              {showColorPicker === repo.id && (
                <div className="absolute right-0 top-full mt-2 z-50 bg-gray-750 border border-gray-600 rounded-lg shadow-xl p-2 min-w-[160px]">
                  <div className="text-xs text-gray-400 mb-2 px-2">Code couleur</div>
                  {availableColors.map((color) => (
                    <button
                      key={color.value || 'none'}
                      onClick={() => onSetColor(repo.id, color.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                        colorClasses.value === color.value ? 'bg-gray-700' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded border-2 ${color.border} ${color.bg}`}></div>
                      <span className="text-sm text-gray-200">{color.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onToggleCollapse(repo.id)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title={isCollapsed ? "Agrandir" : "Réduire"}
            >
              {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
              {repo.language || 'N/A'}
            </span>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 ml-8">
            <span>Mis à jour {formatDate(repo.updated_at)}</span>
            <span>•</span>
            <span>{repo.recent_commits.length} commits récents</span>
          </div>
        )}
      </div>

      {/* Commits List - Masqué si réduit */}
      {!isCollapsed && (
        <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            {repo.recent_commits.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucun commit</p>
            ) : (
              repo.recent_commits.map((commit) => (
                <div key={commit.sha} className="flex items-start gap-3 p-3 bg-gray-750 rounded-lg border border-gray-700">
                  <GitBranch className="text-green-400 mt-1 flex-shrink-0" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {commit.commit.message.split('\n')[0]}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {commit.commit.author.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(commit.commit.author.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GitHubMonitor() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'owned', 'collaborator'
  const [searchQuery, setSearchQuery] = useState('');
  const [repoOrder, setRepoOrder] = useState([]);
  const [collapsedRepos, setCollapsedRepos] = useState(new Set());
  const [repoColors, setRepoColors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [viewType, setViewType] = useState('grid'); // 'grid' ou 'analytics'
  const [repoTags, setRepoTags] = useState({});
  const [showTagPicker, setShowTagPicker] = useState(null);
  const [activeTagFilter, setActiveTagFilter] = useState(null);

  const availableTags = [
    { id: 'b1', name: 'B1', color: 'bg-blue-600', textColor: 'text-blue-100' },
    { id: 'b2', name: 'B2', color: 'bg-green-600', textColor: 'text-green-100' },
    { id: 'projet-cours', name: 'Projet cours', color: 'bg-orange-600', textColor: 'text-orange-100' },
    { id: 'projet-perso', name: 'Projet perso', color: 'bg-purple-600', textColor: 'text-purple-100' },
    { id: 'en-cours', name: 'En cours', color: 'bg-yellow-600', textColor: 'text-yellow-100' },
    { id: 'pas-termine', name: 'Pas terminé', color: 'bg-red-600', textColor: 'text-red-100' },
    { id: 'termine', name: 'Terminé', color: 'bg-emerald-600', textColor: 'text-emerald-100' },
  ];

  const availableColors = [
    { name: 'Aucune', value: null, border: 'border-gray-700', bg: 'bg-gray-800' },
    { name: 'Rouge', value: 'red', border: 'border-red-700', bg: 'bg-red-900/20' },
    { name: 'Orange', value: 'orange', border: 'border-orange-700', bg: 'bg-orange-900/20' },
    { name: 'Jaune', value: 'yellow', border: 'border-yellow-700', bg: 'bg-yellow-900/20' },
    { name: 'Vert', value: 'green', border: 'border-green-700', bg: 'bg-green-900/20' },
    { name: 'Bleu', value: 'blue', border: 'border-blue-700', bg: 'bg-blue-900/20' },
    { name: 'Violet', value: 'purple', border: 'border-purple-700', bg: 'bg-purple-900/20' },
    { name: 'Rose', value: 'pink', border: 'border-pink-700', bg: 'bg-pink-900/20' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Vérifie si on a un token dans le localStorage au démarrage
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setGithubToken(savedToken);
      verifyAndSetToken(savedToken);
    }
  }, []);

  const verifyAndSetToken = async (token) => {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const user = await response.json();
        setUserInfo(user);
        setIsAuthenticated(true);
        setGithubToken(token);
        localStorage.setItem('github_token', token);
        fetchRepos(token);
      } else {
        throw new Error('Token invalide');
      }
    } catch (err) {
      setError('Token invalide ou expiré');
      localStorage.removeItem('github_token');
    }
  };

  const handleLogin = () => {
    if (githubToken) {
      verifyAndSetToken(githubToken);
    }
  };

  const handleLogout = () => {
    setGithubToken('');
    setIsAuthenticated(false);
    setUserInfo(null);
    setRepos([]);
    localStorage.removeItem('github_token');
  };

  const fetchRepos = async (token = githubToken) => {
    if (!token) return;
    
    setLoading(true);
    setError('');
    
    try {
      let allRepos = [];

      // Récupère les repos où l'utilisateur est propriétaire
      const ownedResponse = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (ownedResponse.ok) {
        const ownedRepos = await ownedResponse.json();
        allRepos = [...allRepos, ...ownedRepos.map(r => ({ ...r, access_type: 'owner' }))];
      }

      // Récupère les repos où l'utilisateur est collaborateur
      const collabResponse = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=collaborator', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (collabResponse.ok) {
        const collabRepos = await collabResponse.json();
        allRepos = [...allRepos, ...collabRepos.map(r => ({ ...r, access_type: 'collaborator' }))];
      }

      // Filtre selon le mode de vue
      let filteredRepos = allRepos;
      if (viewMode === 'owned') {
        filteredRepos = allRepos.filter(r => r.access_type === 'owner');
      } else if (viewMode === 'collaborator') {
        filteredRepos = allRepos.filter(r => r.access_type === 'collaborator');
      }

      // Déduplique par ID
      const uniqueRepos = Array.from(new Map(filteredRepos.map(r => [r.id, r])).values());
      
      // Pour chaque repo, récupère les derniers commits
      const reposWithCommits = await Promise.all(
        uniqueRepos.map(async (repo) => {
          try {
            let allCommits = [];
            
            // Essaie d'abord de récupérer les commits de toutes les branches
            try {
              const branchesResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/branches`, {
                headers: {
                  'Authorization': `token ${token}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              });
              
              if (branchesResponse.ok) {
                const branches = await branchesResponse.json();
                
                // Pour chaque branche, récupère les commits
                for (const branch of branches.slice(0, 3)) {
                  try {
                    const commitsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?sha=${branch.name}&per_page=10`, {
                      headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                      }
                    });
                    
                    if (commitsResponse.ok) {
                      const branchCommits = await commitsResponse.json();
                      allCommits = [...allCommits, ...branchCommits];
                    }
                  } catch (branchErr) {
                    console.log(`Erreur branche ${branch.name}:`, branchErr);
                  }
                }
              }
            } catch (branchesErr) {
              console.log('Erreur récupération branches, fallback sur branche par défaut');
            }
            
            // Si aucun commit récupéré, essaie la branche par défaut
            if (allCommits.length === 0) {
              const defaultCommitsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=10`, {
                headers: {
                  'Authorization': `token ${token}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              });
              
              if (defaultCommitsResponse.ok) {
                allCommits = await defaultCommitsResponse.json();
              }
            }
            
            // Déduplique les commits par SHA et garde les 10 plus récents
            const uniqueCommits = Array.from(
              new Map(allCommits.map(c => [c.sha, c])).values()
            )
            .sort((a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date))
            .slice(0, 10);
            
            return {
              ...repo,
              recent_commits: uniqueCommits
            };
          } catch (err) {
            console.log(`Erreur repo ${repo.name}:`, err);
            return {
              ...repo,
              recent_commits: []
            };
          }
        })
      );
      
      setRepos(reposWithCommits);
      
      // Initialise l'ordre seulement pour les nouveaux repos
      setRepoOrder(prevOrder => {
        const existingIds = new Set(prevOrder);
        const newRepoIds = reposWithCommits.map(r => r.id);
        
        // Garde l'ordre existant et ajoute les nouveaux à la fin
        const preserved = prevOrder.filter(id => newRepoIds.includes(id));
        const newIds = newRepoIds.filter(id => !existingIds.has(id));
        
        return [...preserved, ...newIds];
      });
      
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoRefresh && isAuthenticated) {
      const interval = setInterval(() => fetchRepos(), 60000); // Rafraîchit toutes les minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRepos();
    }
  }, [viewMode]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setRepoOrder((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return items;
      }

      const newOrder = arrayMove(items, oldIndex, newIndex);
      localStorage.setItem('repo_order', JSON.stringify(newOrder));
      return newOrder;
    });
  };

  // Récupère l'ordre sauvegardé au chargement
  useEffect(() => {
    const savedOrder = localStorage.getItem('repo_order');
    if (savedOrder) {
      setRepoOrder(JSON.parse(savedOrder));
    }

    const savedCollapsed = localStorage.getItem('collapsed_repos');
    if (savedCollapsed) {
      setCollapsedRepos(new Set(JSON.parse(savedCollapsed)));
    }

    const savedColors = localStorage.getItem('repo_colors');
    if (savedColors) {
      setRepoColors(JSON.parse(savedColors));
    }

    const savedTags = localStorage.getItem('repo_tags');
    if (savedTags) {
      setRepoTags(JSON.parse(savedTags));
    }
  }, []);

  const toggleCollapse = (repoId) => {
    setCollapsedRepos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(repoId)) {
        newSet.delete(repoId);
      } else {
        newSet.add(repoId);
      }
      localStorage.setItem('collapsed_repos', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const setRepoColor = (repoId, color) => {
    setRepoColors(prev => {
      const newColors = { ...prev };
      if (color === null) {
        delete newColors[repoId];
      } else {
        newColors[repoId] = color;
      }
      localStorage.setItem('repo_colors', JSON.stringify(newColors));
      return newColors;
    });
    setShowColorPicker(null);
  };

  const getRepoColorClasses = (repoId) => {
    const color = repoColors[repoId];
    const colorObj = availableColors.find(c => c.value === color);
    return colorObj || availableColors[0];
  };

  const toggleRepoTag = (repoId, tagId) => {
    setRepoTags(prev => {
      const newTags = { ...prev };
      if (!newTags[repoId]) {
        newTags[repoId] = [];
      }
      
      const tagIndex = newTags[repoId].indexOf(tagId);
      if (tagIndex > -1) {
        newTags[repoId] = newTags[repoId].filter(t => t !== tagId);
        if (newTags[repoId].length === 0) {
          delete newTags[repoId];
        }
      } else {
        newTags[repoId] = [...newTags[repoId], tagId];
      }
      
      localStorage.setItem('repo_tags', JSON.stringify(newTags));
      return newTags;
    });
  };

  const getRepoTags = (repoId) => {
    const tagIds = repoTags[repoId] || [];
    return availableTags.filter(tag => tagIds.includes(tag.id));
  };

  // Filtre et trie les repos
  const getDisplayedRepos = () => {
    let filtered = repos;

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(repo => 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par tag
    if (activeTagFilter) {
      filtered = filtered.filter(repo => {
        const tags = repoTags[repo.id] || [];
        return tags.includes(activeTagFilter);
      });
    }

    // Trie selon l'ordre personnalisé
    if (repoOrder.length > 0) {
      filtered = [...filtered].sort((a, b) => {
        const indexA = repoOrder.indexOf(a.id);
        const indexB = repoOrder.indexOf(b.id);
        
        // Si les deux sont dans repoOrder, utilise cet ordre
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        
        // Si seulement A est dans repoOrder, A vient en premier
        if (indexA !== -1) return -1;
        
        // Si seulement B est dans repoOrder, B vient en premier
        if (indexB !== -1) return 1;
        
        // Sinon, garde l'ordre d'origine
        return 0;
      });
    }

    return filtered;
  };

  const displayedRepos = getDisplayedRepos();

  // Ferme le color picker en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowColorPicker(null);
      setShowTagPicker(null);
    };
    if (showColorPicker || showTagPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showColorPicker, showTagPicker]);

  // Calcul des statistiques
  const calculateStats = () => {
    const stats = {
      totalRepos: repos.length,
      totalCommits: 0,
      activeRepos: 0,
      inactiveRepos: 0,
      reposByLanguage: {},
      commitsByAuthor: {},
      recentActivity: [],
      topContributors: [],
    };

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    repos.forEach(repo => {
      // Total commits
      stats.totalCommits += repo.recent_commits.length;

      // Activité (commit dans les 7 derniers jours)
      const lastUpdate = new Date(repo.updated_at);
      if (lastUpdate > sevenDaysAgo) {
        stats.activeRepos++;
      } else {
        stats.inactiveRepos++;
      }

      // Repos par langage
      const lang = repo.language || 'Autre';
      stats.reposByLanguage[lang] = (stats.reposByLanguage[lang] || 0) + 1;

      // Commits par auteur
      repo.recent_commits.forEach(commit => {
        const author = commit.commit.author.name;
        if (!stats.commitsByAuthor[author]) {
          stats.commitsByAuthor[author] = {
            name: author,
            commits: 0,
            repos: new Set(),
            lastCommit: commit.commit.author.date
          };
        }
        stats.commitsByAuthor[author].commits++;
        stats.commitsByAuthor[author].repos.add(repo.name);
        
        // Garde la date du commit le plus récent
        if (new Date(commit.commit.author.date) > new Date(stats.commitsByAuthor[author].lastCommit)) {
          stats.commitsByAuthor[author].lastCommit = commit.commit.author.date;
        }
      });
    });

    // Top contributeurs
    stats.topContributors = Object.values(stats.commitsByAuthor)
      .map(author => ({
        ...author,
        repos: author.repos.size
      }))
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 10);

    // Langages les plus utilisés
    stats.topLanguages = Object.entries(stats.reposByLanguage)
      .map(([lang, count]) => ({ lang, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return stats;
  };

  const stats = calculateStats();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Github className="text-white" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-white text-center mb-2">GitHub Monitor</h1>
            <p className="text-gray-400 text-center mb-8">Connecte-toi pour voir tous tes repos et ceux où tu es invité</p>
            
            {error && (
              <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Personal Access Token
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="ghp_..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleLogin}
                disabled={!githubToken}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Github size={20} />
                Se connecter avec GitHub
              </button>

              <div className="mt-6 p-4 bg-gray-750 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 mb-2 font-medium">Comment créer un token :</p>
                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Va sur GitHub → Settings → Developer settings</li>
                  <li>Personal access tokens → Tokens (classic)</li>
                  <li>Generate new token (classic)</li>
                  <li>Coche les permissions : <code className="bg-gray-700 px-1 rounded">repo</code> et <code className="bg-gray-700 px-1 rounded">read:org</code></li>
                  <li>Copie le token et colle-le ici</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img 
                src={userInfo?.avatar_url} 
                alt={userInfo?.login}
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{userInfo?.name || userInfo?.login}</h1>
                <p className="text-gray-400 text-sm">{repos.length} repos accessibles</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto-refresh (1min)</span>
              </label>

              <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewType('grid')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                    viewType === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Grid3x3 size={18} />
                  <span className="text-sm">Grille</span>
                </button>
                <button
                  onClick={() => setViewType('analytics')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
                    viewType === 'analytics'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <BarChart3 size={18} />
                  <span className="text-sm">Analytics</span>
                </button>
              </div>
              
              <button
                onClick={() => fetchRepos()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
                Rafraîchir
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Filtres de vue */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Afficher:</span>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  viewMode === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setViewMode('owned')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  viewMode === 'owned' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Mes repos
              </button>
              <button
                onClick={() => setViewMode('collaborator')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  viewMode === 'collaborator' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Invitations
              </button>
              
              <div className="mx-2 h-6 w-px bg-gray-600"></div>
              
              {/* Filtres par tags */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <button
                  onClick={() => setActiveTagFilter(null)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    activeTagFilter === null
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Tous
                </button>
                {availableTags.map(tag => {
                  const count = repos.filter(r => (repoTags[r.id] || []).includes(tag.id)).length;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setActiveTagFilter(activeTagFilter === tag.id ? null : tag.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        activeTagFilter === tag.id
                          ? `${tag.color} ${tag.textColor}`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {tag.name} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un repo... (ex: groupie-tracker)"
                className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-3">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Info si recherche active */}
        {searchQuery && viewType === 'grid' && (
          <div className="bg-blue-900/20 border border-blue-700 text-blue-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{displayedRepos.length} repo(s) trouvé(s) pour "{searchQuery}"</span>
            <button onClick={() => setSearchQuery('')} className="text-blue-400 hover:text-blue-300">
              Effacer la recherche
            </button>
          </div>
        )}

        {/* Vue Analytics */}
        {viewType === 'analytics' ? (
          <div className="space-y-6">
            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Repos</p>
                    <p className="text-3xl font-bold text-white">{stats.totalRepos}</p>
                  </div>
                  <div className="bg-blue-900/30 p-3 rounded-lg">
                    <GitBranch className="text-blue-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Commits</p>
                    <p className="text-3xl font-bold text-white">{stats.totalCommits}</p>
                  </div>
                  <div className="bg-green-900/30 p-3 rounded-lg">
                    <TrendingUp className="text-green-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Actifs (7j)</p>
                    <p className="text-3xl font-bold text-green-400">{stats.activeRepos}</p>
                  </div>
                  <div className="bg-green-900/30 p-3 rounded-lg">
                    <Clock className="text-green-400" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Inactifs (&gt;7j)</p>
                    <p className="text-3xl font-bold text-orange-400">{stats.inactiveRepos}</p>
                  </div>
                  <div className="bg-orange-900/30 p-3 rounded-lg">
                    <AlertCircle className="text-orange-400" size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Contributeurs */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-yellow-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Top Contributeurs</h3>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {stats.topContributors.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucun commit trouvé</p>
                  ) : (
                    stats.topContributors.map((contributor, index) => (
                      <div key={contributor.name} className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-600 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-600 text-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{contributor.name}</p>
                          <p className="text-xs text-gray-400">
                            {contributor.commits} commits • {contributor.repos} repo(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{formatDate(contributor.lastCommit)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Langages les plus utilisés */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="text-blue-400" size={24} />
                  <h3 className="text-xl font-bold text-white">Langages Populaires</h3>
                </div>
                <div className="space-y-4">
                  {stats.topLanguages.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucune donnée</p>
                  ) : (
                    stats.topLanguages.map((lang, index) => {
                      const percentage = (lang.count / stats.totalRepos) * 100;
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
                      return (
                        <div key={lang.lang}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{lang.lang}</span>
                            <span className="text-gray-400 text-sm">{lang.count} repos ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div 
                              className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Liste détaillée des repos avec stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Détails par Repo</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Nom</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Langage</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium">Commits</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Dernière MAJ</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repos.map((repo) => {
                      const daysSinceUpdate = Math.floor((new Date() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24));
                      const isActive = daysSinceUpdate <= 7;
                      return (
                        <tr key={repo.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                          <td className="py-3 px-4">
                            <a 
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                            >
                              {repo.name}
                              <ExternalLink size={14} />
                            </a>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                              {repo.language || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-white font-medium">
                            {repo.recent_commits.length}
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">
                            {formatDate(repo.updated_at)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              isActive 
                                ? 'bg-green-900/30 text-green-400 border border-green-700'
                                : 'bg-orange-900/30 text-orange-400 border border-orange-700'
                            }`}>
                              {isActive ? 'Actif' : `${daysSinceUpdate}j`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Repos Grid avec Drag & Drop */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayedRepos.map(r => r.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedRepos.map((repo) => (
                  <SortableRepoCard
                    key={repo.id}
                    repo={repo}
                    formatDate={formatDate}
                    isCollapsed={collapsedRepos.has(repo.id)}
                    onToggleCollapse={toggleCollapse}
                    colorClasses={getRepoColorClasses(repo.id)}
                    showColorPicker={showColorPicker}
                    onToggleColorPicker={(id) => setShowColorPicker(showColorPicker === id ? null : id)}
                    availableColors={availableColors}
                    onSetColor={setRepoColor}
                    tags={getRepoTags(repo.id)}
                    showTagPicker={showTagPicker}
                    onToggleTagPicker={(id) => setShowTagPicker(showTagPicker === id ? null : id)}
                    availableTags={availableTags}
                    onToggleTag={toggleRepoTag}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {loading && repos.length === 0 && (
          <div className="text-center py-20">
            <RefreshCw className="animate-spin text-blue-400 mx-auto mb-4" size={48} />
            <p className="text-gray-400">Chargement des repos...</p>
          </div>
        )}
      </div>
    </div>
  );
}