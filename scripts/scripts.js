
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.querySelector('form');
    const descriptionInput = document.getElementById('descricao');
    const generateBtn = form.querySelector('button[type="submit"]');
    const imageContainer = document.querySelector('.image-container img');
    const saveBtn = document.querySelector('.actions button:first-child');
    const regenerateBtn = document.querySelector('.actions button:last-child');
    const resultSection = document.querySelector('.result-section');

    // Estado da aplicação
    let currentImageUrl = '';
    let isLoading = false;

    // Configuração da API (substitua pela sua chave real em produção)
    const API_KEY = 'sua_chave_api_aqui'; // Em produção, use variáveis de ambiente
    const API_URL = 'https://api.openai.com/v1/images/generations';

    // Mostrar/ocultar loading
    function toggleLoading(show) {
        isLoading = show;
        generateBtn.disabled = show;
        generateBtn.textContent = show ? 'Gerando...' : 'Gerar Imagem';
    }

    // Gerar imagem via API
    async function generateImage(prompt) {
        toggleLoading(true);
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024",
                    response_format: "url"
                })
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            currentImageUrl = data.data[0].url;
            imageContainer.src = currentImageUrl;
            resultSection.style.display = 'block';
            
            // Rolar suavemente para o resultado
            resultSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            alert('Ocorreu um erro ao gerar a imagem. Por favor, tente novamente.');
        } finally {
            toggleLoading(false);
        }
    }

    // Salvar imagem
    async function saveImage() {
        if (!currentImageUrl) return;
        
        try {
            const response = await fetch(currentImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `kaiser-ai-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            alert('Imagem salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar imagem:', error);
            alert('Erro ao salvar a imagem.');
        }
    }

    // Event Listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (isLoading) return;
        
        const prompt = descriptionInput.value.trim();
        if (prompt) {
            generateImage(prompt);
        } else {
            alert('Por favor, descreva a imagem que deseja gerar.');
        }
    });

    saveBtn.addEventListener('click', saveImage);
    regenerateBtn.addEventListener('click', function() {
        if (descriptionInput.value.trim() && !isLoading) {
            generateImage(descriptionInput.value.trim());
        }
    });

    // Esconder a seção de resultados inicialmente
    resultSection.style.display = 'none';
});
