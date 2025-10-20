/**
 * LIVE CONTROLLER
 * Gerencia a lógica de cada live individual
 */

class LiveController {
    constructor(liveData) {
        this.data = liveData;
        this.currentViewers = liveData.baseViewers;
        this.oscillation = liveData.oscillation || 10;
        this.minViewers = liveData.baseViewers - this.oscillation;
        this.maxViewers = liveData.baseViewers + this.oscillation;
        this.viewersInterval = null;
    }

    /**
     * Cria o elemento HTML da live
     */
    createElement() {
        const liveItem = document.createElement('div');
        liveItem.className = 'live-item';
        liveItem.dataset.liveId = this.data.id;

        liveItem.innerHTML = `
            <video 
                class="live-video" 
                src="${this.data.videoUrl}"
                playsinline
                muted
                loop
                preload="metadata"
            ></video>

            <div class="live-overlay">
                <!-- Progress Indicator -->
                <div class="progress-indicator">
                    <div class="progress-bar"></div>
                </div>

                <!-- Header -->
                <div class="live-header">
                    <!-- Streamer Info -->
                    <div class="streamer-info">
                        <div class="streamer-avatar">
                            ${this.getInitials(this.data.streamerName)}
                        </div>
                        <div class="streamer-details">
                            <span class="streamer-name">${this.data.streamerName}</span>
                            <span class="live-badge">Ao Vivo</span>
                        </div>
                    </div>

                    <!-- Viewers Counter -->
                    <div class="viewers-counter">
                        <span class="viewers-icon">👁️</span>
                        <span class="viewers-count">${this.formatViewers(this.currentViewers)}</span>
                    </div>
                </div>
            </div>
        `;

        return liveItem;
    }

    /**
     * Obtém as iniciais do nome do streamer
     */
    getInitials(name) {
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }

    /**
     * Formata o número de viewers
     */
    formatViewers(count) {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'k';
        }
        return count.toString();
    }

    /**
     * Inicia a oscilação do contador de viewers
     */
    startViewersOscillation(element) {
        const viewersCountElement = element.querySelector('.viewers-count');
        
        if (!viewersCountElement) return;

        // Limpa intervalo anterior se existir
        if (this.viewersInterval) {
            clearInterval(this.viewersInterval);
        }

        // Atualiza viewers a cada 3-8 segundos (aleatório para parecer real)
        const oscillate = () => {
            // Gera uma mudança aleatória (-3 a +3 viewers)
            const change = Math.floor(Math.random() * 7) - 3;
            this.currentViewers += change;

            // Garante que fica dentro dos limites
            if (this.currentViewers < this.minViewers) {
                this.currentViewers = this.minViewers;
            }
            if (this.currentViewers > this.maxViewers) {
                this.currentViewers = this.maxViewers;
            }

            // Atualiza o display
            viewersCountElement.textContent = this.formatViewers(this.currentViewers);

            // Agenda próxima atualização em intervalo aleatório
            const nextUpdate = 3000 + Math.random() * 5000; // 3-8 segundos
            this.viewersInterval = setTimeout(oscillate, nextUpdate);
        };

        // Inicia primeira oscilação
        oscillate();
    }

    /**
     * Para a oscilação do contador
     */
    stopViewersOscillation() {
        if (this.viewersInterval) {
            clearTimeout(this.viewersInterval);
            this.viewersInterval = null;
        }
    }

    /**
     * Reproduz o vídeo
     */
    playVideo(element) {
        const video = element.querySelector('.live-video');
        if (video) {
            video.play().catch(err => {
                console.log('Erro ao reproduzir vídeo:', err);
                // Tenta reproduzir mutado se houver erro
                video.muted = true;
                video.play();
            });
        }
    }

    /**
     * Pausa o vídeo
     */
    pauseVideo(element) {
        const video = element.querySelector('.live-video');
        if (video) {
            video.pause();
        }
    }

    /**
     * Atualiza a barra de progresso
     */
    updateProgress(element) {
        const video = element.querySelector('.live-video');
        const progressBar = element.querySelector('.progress-bar');
        
        if (video && progressBar) {
            const updateBar = () => {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = progress + '%';
            };

            video.addEventListener('timeupdate', updateBar);
        }
    }
}

// Exportar para uso global (apenas se não existir)
if (typeof window.LiveController === 'undefined') {
    window.LiveController = LiveController;
}
