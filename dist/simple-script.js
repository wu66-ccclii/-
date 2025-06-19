// ========================================
// 🚀 简化版本脚本 - 无需配置文件
// ========================================

// ========================================
// ⚙️ 自定义设置区域 - 修改指南 5️⃣
// ========================================
const customSettings = {
    // 📱 二维码设置 - 修改下面的内容来自定义二维码
    qrCode: {
        // 🔗 二维码内容设置 - 常见示例：
        // "https://www.baidu.com" - 网址链接
        // "你的微信号" - 纯文字内容  
        // "weixin://" - 打开微信
        // "tel:13800138000" - 拨打电话
        // "mailto:your@email.com" - 发送邮件
        content: "https://developer.harmonyos.com/en/design",  // ← 修改这里：二维码内容
        
        // 🎨 二维码样式设置
        size: 150,              // ← 修改这里：尺寸大小（像素）
        color: '#2563eb',       // ← 修改这里：前景色（16进制颜色代码）
        background: '#ffffff'   // ← 修改这里：背景色（16进制颜色代码）
    }
};

// 全局变量
let currentTheme = 'light';
let clickCount = 856; // 点击统计

// DOM 元素
const elements = {
    shareModal: document.getElementById('shareModal'),
    closeShareModal: document.getElementById('closeShareModal'),
    shareBtn: document.getElementById('shareBtn'),
    themeBtn: document.getElementById('themeBtn'),
    analyticsBtn: document.getElementById('analyticsBtn'),
    shareUrl: document.getElementById('shareUrl'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    qrCanvas: document.getElementById('qrCanvas')
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 页面加载完成');
    initializeApp();
    setupEventListeners();
    generateQRCode();
    setupLinkTracking();
    initMouseEffects(); // 初始化鼠标特效
});

// 初始化应用
function initializeApp() {
    console.log('🚀 应用初始化中...');
    
    // 设置分享URL
    if (elements.shareUrl) {
        elements.shareUrl.value = window.location.href;
    }
    
    // 添加主题切换动画
    document.body.classList.add('theme-transition');
    
    // 从本地存储加载主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            updateThemeButton();
        }
    }
    
    // 加载统计数据
    loadFromStorage();
}

// 设置事件监听器
function setupEventListeners() {
    // 分享相关
    if (elements.shareBtn) {
        elements.shareBtn.addEventListener('click', openShareModal);
    }
    if (elements.closeShareModal) {
        elements.closeShareModal.addEventListener('click', closeShareModal);
    }
    if (elements.copyUrlBtn) {
        elements.copyUrlBtn.addEventListener('click', copyShareUrl);
    }
    
    // 工具栏按钮
    if (elements.themeBtn) {
        elements.themeBtn.addEventListener('click', toggleTheme);
    }
    if (elements.analyticsBtn) {
        elements.analyticsBtn.addEventListener('click', showAnalytics);
    }
    
    // 点击模态框背景关闭
    if (elements.shareModal) {
        elements.shareModal.addEventListener('click', function(e) {
            if (e.target === this) closeShareModal();
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.shareModal.classList.contains('active')) {
            closeShareModal();
        }
    });
}

// 打开分享模态框
function openShareModal() {
    if (elements.shareModal) {
        elements.shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        elements.shareUrl.value = window.location.href;
        elements.shareUrl.select(); // 自动选中链接
    }
}

// 关闭分享模态框
function closeShareModal() {
    if (elements.shareModal) {
        elements.shareModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 复制分享链接
function copyShareUrl() {
    if (elements.shareUrl && elements.copyUrlBtn) {
        elements.shareUrl.select();
        
        try {
            // 使用现代剪贴板API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(elements.shareUrl.value).then(() => {
                    showCopySuccess();
                });
            } else {
                // 兼容旧浏览器
                document.execCommand('copy');
                showCopySuccess();
            }
        } catch (err) {
            console.error('复制失败:', err);
            showNotification('复制失败，请手动复制', 'error');
        }
    }
}

// 显示复制成功效果
function showCopySuccess() {
    const originalText = elements.copyUrlBtn.innerHTML;
    elements.copyUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
    elements.copyUrlBtn.style.background = '#28a745';
    
    setTimeout(() => {
        elements.copyUrlBtn.innerHTML = originalText;
        elements.copyUrlBtn.style.background = '';
    }, 2000);
    
    showNotification('链接已复制到剪贴板！', 'success');
}

// 切换主题
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme');
    
    // 保存到本地存储
    localStorage.setItem('theme', currentTheme);
    
    updateThemeButton();
    showNotification(`已切换到${currentTheme === 'dark' ? '深色' : '浅色'}主题`, 'success');
}

// 更新主题按钮文字
function updateThemeButton() {
    if (elements.themeBtn) {
        const themeText = currentTheme === 'dark' ? '浅色' : '深色';
        const icon = currentTheme === 'dark' ? 'fa-sun' : 'fa-palette';
        elements.themeBtn.innerHTML = `<i class="fas ${icon}"></i><span>${themeText}</span>`;
    }
}

// 显示统计信息
function showAnalytics() {
    // 获取当前统计数据
    const followersElement = document.querySelector('.stat-number');
    const clicksElement = document.querySelectorAll('.stat-number')[1];
    const linksElement = document.querySelectorAll('.stat-number')[2];
    
    const followers = followersElement ? followersElement.textContent : '1.2K';
    const clicks = clicksElement ? clicksElement.textContent : clickCount;
    const links = linksElement ? linksElement.textContent : '3';
    
    const message = `📊 数据统计\n👥 关注者：${followers}\n👆 总点击：${clicks}\n🔗 链接数：${links}`;
    showNotification(message, 'info', 5000);
}

// 生成二维码
function generateQRCode() {
    if (elements.qrCanvas) {
        if (typeof QRious !== 'undefined') {
            try {
                const qr = new QRious({
                    element: elements.qrCanvas,
                    value: customSettings.qrCode.content,        // 使用自定义内容
                    size: customSettings.qrCode.size,            // 使用自定义尺寸
                    background: customSettings.qrCode.background, // 使用自定义背景色
                    foreground: customSettings.qrCode.color,     // 使用自定义前景色
                    level: 'M'
                });
                console.log('✅ 二维码生成成功，内容:', customSettings.qrCode.content);
            } catch (error) {
                console.error('二维码生成失败:', error);
                drawPlaceholderQR();
            }
        } else {
            console.warn('QRious 库未加载，使用占位符');
            drawPlaceholderQR();
        }
    }
}

// 绘制占位符二维码
function drawPlaceholderQR() {
    if (elements.qrCanvas) {
        elements.qrCanvas.width = customSettings.qrCode.size;
        elements.qrCanvas.height = customSettings.qrCode.size;
        const ctx = elements.qrCanvas.getContext('2d');
        
        const size = customSettings.qrCode.size;
        
        // 绘制背景
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, size, size);
        
        // 绘制边框
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size-2, size-2);
        
        // 绘制文字
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('二维码', size/2, size/2-10);
        ctx.font = '12px Arial';
        ctx.fillText('点击刷新', size/2, size/2+10);
        
        // 添加点击事件重新生成
        elements.qrCanvas.style.cursor = 'pointer';
        elements.qrCanvas.onclick = generateQRCode;
    }
}

// 链接点击追踪
function setupLinkTracking() {
    document.querySelectorAll('[data-analytics]').forEach(link => {
        link.addEventListener('click', function(e) {
            const linkName = this.getAttribute('data-analytics');
            trackLinkClick(linkName);
        });
    });
}

function trackLinkClick(linkName) {
    clickCount++;
    console.log(`📈 点击追踪: ${linkName}, 总点击数: ${clickCount}`);
    
    // 更新页面显示
    updateClickDisplay();
    
    // 保存到本地存储
    localStorage.setItem('clickCount', clickCount);
}

// 显示通知
function showNotification(message, type = 'info', duration = 3000) {
    // 移除已存在的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // 设置颜色
    const colors = {
        success: '#28a745',
        error: '#dc3545', 
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // 设置内容
    notification.innerHTML = message.replace(/\n/g, '<br>');
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动消失
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// 从本地存储加载数据
function loadFromStorage() {
    const savedClickCount = localStorage.getItem('clickCount');
    if (savedClickCount) {
        clickCount = parseInt(savedClickCount);
        // 更新页面显示的点击数
        updateClickDisplay();
    }
}

// 更新页面上的点击数显示
function updateClickDisplay() {
    const clicksElement = document.querySelectorAll('.stat-number')[1];
    if (clicksElement) {
        clicksElement.textContent = clickCount;
    }
}

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面重新可见时，刷新二维码
        generateQRCode();
    }
});

console.log('🎉 简化版脚本加载完成！');

// ========================= 🖱️ 高级鼠标特效系统 =========================

// 鼠标特效变量
let mouseX = 0;
let mouseY = 0;
let customCursor = null;
let mouseGlow = null;
let trailElements = [];
let isMouseDown = false;

// 初始化鼠标特效
function initMouseEffects() {
    // 检测是否为移动设备
    if (window.innerWidth <= 768) {
        console.log('📱 移动设备，跳过鼠标特效');
        return;
    }

    console.log('🖱️ 初始化鼠标特效');
    createCustomCursor();
    createMouseGlow();
    setupMouseListeners();
    addMagneticEffect();
    initAvatarEffects();
}

// 创建自定义光标
function createCustomCursor() {
    customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);
    console.log('✅ 自定义光标已创建');
}

// 创建鼠标光晕
function createMouseGlow() {
    mouseGlow = document.createElement('div');
    mouseGlow.className = 'mouse-glow';
    document.body.appendChild(mouseGlow);
}

// 设置鼠标事件监听
function setupMouseListeners() {
    // 鼠标移动
    document.addEventListener('mousemove', handleMouseMove);
    
    // 鼠标按下
    document.addEventListener('mousedown', handleMouseDown);
    
    // 鼠标松开
    document.addEventListener('mouseup', handleMouseUp);
    
    // 鼠标进入页面
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // 鼠标离开页面
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // 为可交互元素添加悬停效果
    const interactiveElements = document.querySelectorAll('a, button, .tool-btn, .main-link, .stat-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (customCursor) {
                customCursor.classList.add('hover');
                createHoverParticles();
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (customCursor) {
                customCursor.classList.remove('hover');
            }
        });
        
        // 为链接添加鼠标跟踪效果
        if (element.classList.contains('main-link')) {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                element.style.setProperty('--mouse-x', x + '%');
                element.style.setProperty('--mouse-y', y + '%');
            });
        }
    });
}

// 增强鼠标移动处理
function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // 即时更新光标位置（居中显示）
    if (customCursor) {
        // 根据光标大小动态调整偏移
        const cursorSize = customCursor.classList.contains('hover') ? 15 : 
                          customCursor.classList.contains('click') ? 9 : 12;
        const offset = cursorSize / 2;
        customCursor.style.transform = `translate(${mouseX - offset}px, ${mouseY - offset}px)`;
    }
    
    // 即时更新彩虹光晕位置（居中显示）
    if (mouseGlow) {
        mouseGlow.style.transform = `translate(${mouseX - 100}px, ${mouseY - 100}px)`;
    }
    
    // 增加轨迹生成频率，创造更丰富的效果
    if (Math.random() < 0.05) {
        createRainbowTrail();
    }
    
    // 添加随机魔法粒子
    if (Math.random() < 0.01) {
        createMagicParticle();
    }
}

// 处理鼠标按下
function handleMouseDown(e) {
    isMouseDown = true;
    
    if (customCursor) {
        customCursor.classList.add('click');
    }
    
    // 创建点击涟漪效果
    createClickRipple(e.clientX, e.clientY);
}

// 处理鼠标松开
function handleMouseUp() {
    isMouseDown = false;
    
    if (customCursor) {
        customCursor.classList.remove('click');
    }
}

// 鼠标进入页面
function handleMouseEnter() {
    if (mouseGlow) {
        mouseGlow.classList.add('active');
    }
}

// 鼠标离开页面
function handleMouseLeave() {
    if (mouseGlow) {
        mouseGlow.classList.remove('active');
    }
}

// 彩虹轨迹效果
function createRainbowTrail() {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.transform = `translate(${mouseX - 2}px, ${mouseY - 2}px)`;
    
    document.body.appendChild(trail);
    
    // 与CSS动画同步清理
    setTimeout(() => {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
    }, 400);
}

// 随机魔法粒子
function createMagicParticle() {
    const particle = document.createElement('div');
    particle.className = 'hover-particle';
    
    // 添加随机星星效果
    if (Math.random() < 0.3) {
        particle.classList.add('star');
    }
    
    // 随机偏移位置
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;
    
    particle.style.transform = `translate(${mouseX + offsetX - 1.5}px, ${mouseY + offsetY - 1.5}px)`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 800);
}

// 炫彩涟漪效果
function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.transform = `translate(${x}px, ${y}px)`;
    
    document.body.appendChild(ripple);
    
    // 创建额外的爆炸粒子
    createClickBurstParticles(x, y);
    
    // 与CSS动画同步清理
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// 点击爆炸粒子效果
function createClickBurstParticles(x, y) {
    const colors = ['#667eea', '#f093fb', '#ffecd2', '#a8edea'];
    
    // 创建8个方向的爆炸粒子
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            
            // 随机选择颜色和形状
            if (Math.random() < 0.4) {
                particle.classList.add('star');
            }
            
            // 计算8个方向的位置
            const angle = (i * 45) * Math.PI / 180;
            const distance = 30 + Math.random() * 20;
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            
            particle.style.transform = `translate(${x + offsetX - 1.5}px, ${y + offsetY - 1.5}px)`;
            particle.style.color = colors[i % colors.length];
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }, i * 20); // 交错产生效果
    }
}

// 增强悬停粒子效果
function createHoverParticles() {
    const colors = ['#667eea', '#f093fb', '#ffecd2', '#a8edea'];
    
    // 生成多个魔法粒子
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            
            // 30%概率生成星星形状
            if (Math.random() < 0.3) {
                particle.classList.add('star');
            }
            
            // 随机颜色
            particle.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            // 更大的随机范围，创造更丰富的效果
            const offsetX = (Math.random() - 0.5) * 25;
            const offsetY = (Math.random() - 0.5) * 25;
            
            particle.style.transform = `translate(${mouseX + offsetX - 1.5}px, ${mouseY + offsetY - 1.5}px)`;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }, i * 100); // 交错产生
    }
}

// 添加磁性效果
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.main-link, .tool-btn, .avatar-container');
    
    magneticElements.forEach(element => {
        element.classList.add('magnetic-hover');
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.1;
            const deltaY = (e.clientY - centerY) * 0.1;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
}

// 清理所有鼠标特效
function cleanupMouseEffects() {
    // 清理轨迹元素
    const trails = document.querySelectorAll('.mouse-trail');
    trails.forEach(trail => trail.remove());
    
    // 清理涟漪元素
    const ripples = document.querySelectorAll('.click-ripple');
    ripples.forEach(ripple => ripple.remove());
    
    // 清理粒子元素
    const particles = document.querySelectorAll('.hover-particle');
    particles.forEach(particle => particle.remove());
}

// 窗口大小改变时重新初始化
window.addEventListener('resize', () => {
    // 如果从桌面切换到移动端，清理特效
    if (window.innerWidth <= 768) {
        cleanupMouseEffects();
        if (customCursor) {
            customCursor.remove();
            customCursor = null;
        }
        if (mouseGlow) {
            mouseGlow.remove();
            mouseGlow = null;
        }
    } else if (!customCursor) {
        // 如果从移动端切换到桌面，重新初始化
        initMouseEffects();
    }
});

// 页面隐藏时清理资源
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cleanupMouseEffects();
    }
});

// ========================= 🖼️ 头像特效增强系统 =========================

// 初始化头像特效
function initAvatarEffects() {
    console.log('🖼️ 初始化头像特效');
    const avatarContainer = document.querySelector('.avatar-container');
    const avatar = document.querySelector('.avatar');
    
    if (!avatarContainer || !avatar) {
        console.warn('头像元素未找到');
        return;
    }
    
    // 添加头像点击效果
    setupAvatarClickEffect(avatar);
    
    // 添加头像跟随视差效果
    setupAvatarParallax(avatarContainer);
    
    // 添加头像呼吸效果
    setupAvatarBreathing(avatarContainer);
    
    // 添加头像加载动画
    setupAvatarLoadAnimation(avatar);
    
    // 强制确保头像居中
    forceAvatarCenter(avatar, avatarContainer);
}

// 头像点击特效
function setupAvatarClickEffect(avatar) {
    avatar.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 创建点击波纹
        createAvatarRipple(e);
        
        // 头像震动效果
        avatar.style.animation = 'none';
        setTimeout(() => {
            avatar.style.animation = 'avatarShake 0.5s ease-in-out';
        }, 10);
        
        // 显示特殊通知
        showNotification('✨ 头像被点击了！你真有眼光~', 'success', 2000);
        
        console.log('🖼️ 头像被点击');
    });
}

// 创建头像点击波纹
function createAvatarRipple(e) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        transform: translate(-50%, -50%) scale(0);
        animation: avatarRippleExpand 0.8s ease-out forwards;
    `;
    
    const rect = e.target.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    
    e.target.parentNode.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 800);
}

// 头像视差效果
function setupAvatarParallax(avatarContainer) {
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth <= 768) return; // 移动端跳过
        
        const rect = avatarContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / window.innerWidth;
        const deltaY = (e.clientY - centerY) / window.innerHeight;
        
        // 轻微的头像跟随效果
        const moveX = deltaX * 3; // 减小移动幅度
        const moveY = deltaY * 3;
        
        // 只对容器应用轻微偏移，不影响内部元素的居中
        avatarContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        // 确保头像本身保持居中
        const avatar = avatarContainer.querySelector('.avatar');
        if (avatar) {
            avatar.style.transform = 'translate(-50%, -50%)';
        }
    });
}

// 头像呼吸效果
function setupAvatarBreathing(avatarContainer) {
    let breathingActive = true;
    
    function breathe() {
        if (!breathingActive) return;
        
        avatarContainer.style.transition = 'filter 2s ease-in-out';
        avatarContainer.style.filter = `
            drop-shadow(0 0 40px rgba(102, 126, 234, 0.4))
            brightness(1.05)
        `;
        
        setTimeout(() => {
            if (!breathingActive) return;
            avatarContainer.style.filter = `
                drop-shadow(0 0 30px rgba(102, 126, 234, 0.3))
                brightness(1)
            `;
        }, 2000);
        
        setTimeout(breathe, 4000);
    }
    
    // 鼠标悬停时停止呼吸效果
    avatarContainer.addEventListener('mouseenter', () => {
        breathingActive = false;
    });
    
    avatarContainer.addEventListener('mouseleave', () => {
        breathingActive = true;
        setTimeout(breathe, 1000);
    });
    
    // 开始呼吸效果
    breathe();
}

// 头像加载动画
function setupAvatarLoadAnimation(avatar) {
    // 检查图片是否已加载
    if (avatar.complete) {
        triggerLoadAnimation();
    } else {
        avatar.addEventListener('load', triggerLoadAnimation);
        avatar.addEventListener('error', () => {
            console.warn('头像加载失败');
            triggerLoadAnimation(); // 即使失败也显示动画
        });
    }
    
    function triggerLoadAnimation() {
        avatar.style.opacity = '0';
        avatar.style.transform = 'scale(0.8)';
        avatar.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            avatar.style.opacity = '1';
            avatar.style.transform = 'scale(1)';
        }, 100);
        
        // 延迟显示欢迎效果
        setTimeout(() => {
            showNotification('🎉 欢迎来到小南资源库！', 'info', 3000);
        }, 1000);
    }
}

// 添加头像动画样式
const avatarAnimationStyles = document.createElement('style');
avatarAnimationStyles.textContent = `
    @keyframes avatarShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px) rotate(-1deg); }
        75% { transform: translateX(3px) rotate(1deg); }
    }
    
    @keyframes avatarRippleExpand {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
        }
    }
    
    .avatar-glow-pulse {
        animation: avatarGlowPulse 1.5s ease-in-out;
    }
    
    @keyframes avatarGlowPulse {
        0%, 100% {
            filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.3));
        }
        50% {
            filter: drop-shadow(0 0 60px rgba(102, 126, 234, 0.8));
        }
    }
`;

document.head.appendChild(avatarAnimationStyles);

// 强制头像居中函数
function forceAvatarCenter(avatar, avatarContainer) {
    console.log('🎯 强制设置头像居中');
    
    // 强制设置头像居中
    if (avatar) {
        avatar.style.position = 'absolute';
        avatar.style.top = '50%';
        avatar.style.left = '50%';
        avatar.style.transform = 'translate(-50%, -50%)';
        avatar.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
    }
    
    // 强制设置边框居中
    const avatarBorder = avatarContainer.querySelector('.avatar-border');
    if (avatarBorder) {
        avatarBorder.style.position = 'absolute';
        avatarBorder.style.top = '50%';
        avatarBorder.style.left = '50%';
        avatarBorder.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
    }
    
    // 定期检查并修正位置
    setInterval(() => {
        if (avatar && avatar.style.transform !== 'translate(-50%, -50%)') {
            avatar.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
        }
    }, 1000);
    
    console.log('✅ 头像居中设置完成');
} 