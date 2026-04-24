import React from 'react';
import { toast } from 'react-hot-toast';

const MetricCard = ({ title, value, status }) => {
  const statusConfig = {
    Good: {
      color: 'emerald',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    Warning: {
      color: 'amber',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    Bad: {
      color: 'rose',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const config = statusConfig[status] || statusConfig.Good;
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50/50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      badge: 'bg-emerald-100 text-emerald-700',
      iconColor: 'text-emerald-500'
    },
    amber: {
      bg: 'bg-amber-50/50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      badge: 'bg-amber-100 text-amber-700',
      iconColor: 'text-amber-500'
    },
    rose: {
      bg: 'bg-rose-50/50',
      text: 'text-rose-700',
      border: 'border-rose-100',
      badge: 'bg-rose-100 text-rose-700',
      iconColor: 'text-rose-500'
    }
  };

  const colors = colorMap[config.color];

  const handleClick = () => {
    toast(`Viewing detailed logs for ${title}`, {
      icon: '📊',
      style: {
        borderRadius: '12px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative overflow-hidden group p-6 rounded-2xl border ${colors.bg} ${colors.border} transition-all duration-300 hover:shadow-xl hover:shadow-${config.color}-500/10 hover:-translate-y-1 cursor-pointer active:scale-95`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg bg-white shadow-sm ${colors.iconColor}`}>
          {config.icon}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors.badge}`}>
          {status}
        </span>
      </div>
      
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-500 transition-colors">
          {title}
        </h4>
        <p className={`text-3xl font-black tracking-tight ${colors.text}`}>
          {value}
        </p>
      </div>

      <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`}>
        <div className="w-24 h-24 transform rotate-12">
          {config.icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
