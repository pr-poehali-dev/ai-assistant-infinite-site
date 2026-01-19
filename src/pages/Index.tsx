import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Привет! Я ваш умный ИИ-ассистент. Готов помочь с любыми вопросами! 🚀',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const currentInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/978cb2bc-bb36-4a20-b541-0b10c5064c87', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages.map(msg => ({ role: msg.role, content: msg.content }))
        })
      });

      const data = await response.json();

      if (response.ok) {
        const aiResponse: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        const errorResponse: Message = {
          role: 'assistant',
          content: `Извините, произошла ошибка: ${data.error || 'Не удалось получить ответ'}. Пожалуйста, убедитесь, что API-ключ OpenAI настроен корректно.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      const errorResponse: Message = {
        role: 'assistant',
        content: 'Произошла ошибка при отправке сообщения. Проверьте подключение к интернету или попробуйте позже.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const capabilities = [
    { icon: 'Brain', title: 'Умный анализ', desc: 'Глубокое понимание контекста и сложных запросов' },
    { icon: 'Zap', title: 'Мгновенные ответы', desc: 'Быстрая обработка любых вопросов' },
    { icon: 'Languages', title: 'Мультиязычность', desc: 'Поддержка множества языков' },
    { icon: 'Code', title: 'Помощь с кодом', desc: 'Генерация и объяснение программного кода' },
    { icon: 'BookOpen', title: 'Обучение', desc: 'Объяснение сложных концепций простым языком' },
    { icon: 'Sparkles', title: 'Креативность', desc: 'Генерация идей и творческого контента' }
  ];

  const faqs = [
    { q: 'Что умеет ИИ-ассистент?', a: 'Я могу отвечать на вопросы, помогать с задачами, генерировать контент, объяснять сложные темы, писать код и многое другое!' },
    { q: 'Как начать работу?', a: 'Просто перейдите во вкладку "Чат" и задайте любой вопрос. Я мгновенно отвечу!' },
    { q: 'Безопасны ли мои данные?', a: 'Да! Все данные защищены и обрабатываются конфиденциально.' },
    { q: 'Можно ли использовать на мобильных?', a: 'Конечно! Сайт полностью адаптивен для всех устройств.' },
    { q: 'Есть ли ограничения?', a: 'В текущей версии нет ограничений по количеству запросов.' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-gradient bg-[length:200%_200%]">
              <Icon name="Sparkles" className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold gradient-text">AI Assistant</span>
          </div>
          
          <div className="hidden md:flex gap-6">
            {['home', 'chat', 'history', 'features', 'contact', 'faq'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground glow-primary'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                {tab === 'home' && 'Главная'}
                {tab === 'chat' && 'Чат'}
                {tab === 'history' && 'История'}
                {tab === 'features' && 'Возможности'}
                {tab === 'contact' && 'Контакты'}
                {tab === 'faq' && 'FAQ'}
              </button>
            ))}
          </div>

          <Button className="md:hidden" variant="ghost" size="icon">
            <Icon name="Menu" size={24} />
          </Button>
        </div>
      </nav>

      <main className="pt-20 container mx-auto px-4">
        {activeTab === 'home' && (
          <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-3xl opacity-30 animate-glow" />
              <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4 relative">
                AI Assistant
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl animate-slide-up">
              Ваш умный помощник, доступный 24/7. Получайте ответы на любые вопросы мгновенно!
            </p>

            <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button 
                size="lg" 
                className="text-lg px-8 glow-primary"
                onClick={() => setActiveTab('chat')}
              >
                <Icon name="MessageSquare" className="mr-2" />
                Начать чат
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => setActiveTab('features')}
              >
                <Icon name="Sparkles" className="mr-2" />
                Возможности
              </Button>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                { icon: 'Zap', title: 'Быстро', desc: 'Мгновенные ответы' },
                { icon: 'Shield', title: 'Безопасно', desc: 'Защита данных' },
                { icon: 'Globe', title: 'Всегда онлайн', desc: '24/7 доступность' }
              ].map((item, idx) => (
                <Card 
                  key={idx} 
                  className="p-6 gradient-bg border-border/50 hover:border-primary/50 transition-all hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                >
                  <Icon name={item.icon as any} className="mb-4 text-primary" size={32} />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="min-h-[calc(100vh-5rem)] py-8 animate-fade-in">
            <Card className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col gradient-bg border-border/50">
              <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
                  <Icon name="Bot" size={28} />
                  Чат с ИИ-ассистентом
                </h2>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 animate-slide-up ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                          <Icon name="Bot" size={18} className="text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-card border border-border'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span className="text-xs opacity-60 mt-2 block">
                          {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center flex-shrink-0">
                          <Icon name="User" size={18} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 animate-slide-up">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon name="Bot" size={18} className="text-white" />
                      </div>
                      <div className="bg-card border border-border p-4 rounded-2xl">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Задайте любой вопрос..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !inputValue.trim()}
                    className="glow-primary"
                  >
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="min-h-[calc(100vh-5rem)] py-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold gradient-text mb-8">История чатов</h2>
              
              <div className="space-y-4">
                {[
                  { title: 'Что такое искусственный интеллект?', date: '19 января 2026', messages: 15 },
                  { title: 'Помощь с программированием на Python', date: '18 января 2026', messages: 23 },
                  { title: 'Объяснение квантовой физики', date: '17 января 2026', messages: 8 }
                ].map((chat, idx) => (
                  <Card 
                    key={idx}
                    className="p-6 gradient-bg border-border/50 hover:border-primary/50 transition-all hover:scale-[1.02] cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    onClick={() => setActiveTab('chat')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                          <Icon name="MessageSquare" className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{chat.title}</h3>
                          <p className="text-sm text-muted-foreground">{chat.date} · {chat.messages} сообщений</p>
                        </div>
                      </div>
                      <Icon name="ChevronRight" className="text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="min-h-[calc(100vh-5rem)] py-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Возможности</h2>
                <p className="text-xl text-muted-foreground">Всё, что нужно для эффективной работы</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {capabilities.map((cap, idx) => (
                  <Card 
                    key={idx}
                    className="p-6 gradient-bg border-border/50 hover:border-primary/50 transition-all hover:scale-105 animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mb-4 glow-primary">
                      <Icon name={cap.icon as any} className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{cap.title}</h3>
                    <p className="text-muted-foreground">{cap.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="min-h-[calc(100vh-5rem)] py-8 flex items-center justify-center animate-fade-in">
            <Card className="max-w-lg w-full p-8 gradient-bg border-border/50">
              <h2 className="text-3xl font-bold gradient-text mb-6 text-center">Связаться с нами</h2>
              
              <div className="space-y-6 mb-8">
                {[
                  { icon: 'Mail', label: 'Email', value: 'support@aiassistant.com' },
                  { icon: 'MessageCircle', label: 'Telegram', value: '@aiassistant_support' },
                  { icon: 'Phone', label: 'Телефон', value: '+7 (999) 123-45-67' }
                ].map((contact, idx) => (
                  <div key={idx} className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Icon name={contact.icon as any} className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{contact.label}</p>
                      <p className="font-semibold">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Input placeholder="Ваше имя" />
                <Input placeholder="Email" type="email" />
                <textarea 
                  className="w-full p-3 rounded-lg bg-background border border-border resize-none"
                  rows={4}
                  placeholder="Сообщение"
                />
                <Button className="w-full glow-primary">
                  <Icon name="Send" className="mr-2" />
                  Отправить
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="min-h-[calc(100vh-5rem)] py-8 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold gradient-text mb-4">Частые вопросы</h2>
                <p className="text-xl text-muted-foreground">Ответы на популярные вопросы</p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem 
                    key={idx} 
                    value={`item-${idx}`}
                    className="border border-border rounded-lg px-6 gradient-bg animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <AccordionTrigger className="text-left hover:text-primary">
                      <span className="font-semibold">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Card className="mt-12 p-8 gradient-bg border-border/50 text-center">
                <Icon name="HelpCircle" className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="text-2xl font-bold mb-2">Не нашли ответ?</h3>
                <p className="text-muted-foreground mb-4">Свяжитесь с нами, и мы поможем!</p>
                <Button onClick={() => setActiveTab('contact')} className="glow-primary">
                  <Icon name="MessageSquare" className="mr-2" />
                  Написать нам
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">© 2026 AI Assistant. Работает на основе передовых технологий ИИ</p>
          <div className="flex items-center justify-center gap-4">
            <Icon name="Sparkles" className="text-primary" size={16} />
            <span className="text-sm">Создано с использованием React, TypeScript и любви к инновациям</span>
            <Icon name="Heart" className="text-secondary" size={16} />
          </div>
        </div>
      </footer>
    </div>
  );
}