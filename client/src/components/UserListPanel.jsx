import { useState, useEffect } from 'react';

// Format duration for display
const formatDuration = (seconds) => {
	if (!seconds || seconds < 60) return '0m';
	const mins = Math.floor(seconds / 60);
	if (mins < 60) return `${mins}m`;
	const hours = Math.floor(mins / 60);
	return `${hours}h ${mins % 60}m`;
};

// Format time since join
const formatTimeSinceJoin = (joinedAt) => {
	if (!joinedAt) return '';
	const now = Date.now();
	const diff = Math.floor((now - joinedAt) / 1000 / 60);
	if (diff < 1) return 'şimdi';
	if (diff < 60) return `${diff}dk önce`;
	const hours = Math.floor(diff / 60);
	return `${hours}s önce`;
};

const UserListPanel = ({ users = [], currentUser, onEditName }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [, setUpdateTrigger] = useState(0);

	// Force re-render every 1 second for real-time updates
	useEffect(() => {
		const interval = setInterval(() => {
			setUpdateTrigger(prev => prev + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// Handle toggle with proper touch support
	const handleToggle = (e) => {
		// Only toggle on click, not on touch devices where hover doesn't work
		if (window.matchMedia('(hover: hover)').matches) {
			// On desktop, click is used to toggle sticky state
			return;
		}
		// On mobile, click toggles
		e.stopPropagation();
		setIsExpanded(prev => !prev);
	};

	// Handle mouse events only on desktop (not touch devices)
	const handleMouseEnter = () => {
		if (window.matchMedia('(hover: hover)').matches) {
			setIsExpanded(true);
		}
	};

	const handleMouseLeave = () => {
		if (window.matchMedia('(hover: hover)').matches) {
			setIsExpanded(false);
		}
	};

	if (!users || users.length === 0) return null;

	return (
		<div
			className={`user-panel ${isExpanded ? 'user-panel--expanded' : ''}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleToggle}
		>
			{/* Panel Header - Just count when collapsed */}
			<div className="user-panel-header">
				<span className="user-panel-count">{users.length} </span>
			</div>

			{/* User List - Only visible when expanded */}
			{isExpanded && (
				<div className="user-panel-list">
					{users.map((user) => {
						const isCurrentUser = user.userId === currentUser?.userId;

						return (
							<div
								key={user.socketId || user.userId}
								className={`user-panel-item ${isCurrentUser ? 'user-panel-item--current' : ''}`}
								onClick={(e) => {
									if (isCurrentUser) {
										e.stopPropagation();
										onEditName?.();
									}
								}}
							>
								{/* User Avatar */}
								<div className="user-panel-avatar">
									{user.userName?.charAt(0)?.toUpperCase() || '?'}
								</div>

								{/* User Info */}
								<div className="user-panel-info">
									<div className="user-panel-name">
										{user.userName || 'İsimsiz'}
										{isCurrentUser && <span className="user-panel-you">(Sen)</span>}
									</div>

									{/* Stats */}
									<div className="user-panel-stats user-panel-stats--visible">
										<span className="user-stat user-stat--work">
											🎯 {formatDuration(user.workTime)}
										</span>
										<span className="user-stat user-stat--break">
											☕ {formatDuration(user.breakTime)}
										</span>
										<span className="user-stat user-stat--joined">
											· {formatTimeSinceJoin(user.joinedAt)}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default UserListPanel;
