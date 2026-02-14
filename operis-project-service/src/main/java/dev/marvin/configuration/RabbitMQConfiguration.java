package dev.marvin.configuration;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfiguration {
    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;
    @Value("${rabbitmq.queue.notification-service}")
    private String notificationQueue;
    @Value("${rabbitmq.queue.cta-service}")
    private String ctaQueue;
    @Value("${rabbitmq.routing.new}")
    private String newInviteRoutingKey;
    @Value("${rabbitmq.routing.accept}")
    private String acceptRoutingKey;
    @Value("${rabbitmq.routing.reject}")
    private String rejectRoutingKey;

    @Bean
    public TopicExchange topicExchange(){
        return ExchangeBuilder.topicExchange(exchangeName).durable(true).build();
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable(notificationQueue).build();
    }

    @Bean
    public Queue ctaQueue() {
        return QueueBuilder.durable(ctaQueue).build();
    }


    @Bean
    public Binding bindNotification() {
        return BindingBuilder.bind(notificationQueue())
                .to(topicExchange())
                .with(newInviteRoutingKey);
    }

    @Bean
    public Binding bindCTA() {
        return BindingBuilder.bind(ctaQueue())
                .to(topicExchange())
                .with(newInviteRoutingKey);
    }

    @Bean
    public Binding bindCTAAccept() {
        return BindingBuilder.bind(ctaQueue())
                .to(topicExchange())
                .with(acceptRoutingKey);
    }

    @Bean
    public Binding bindCTAReject() {
        return BindingBuilder.bind(ctaQueue())
                .to(topicExchange())
                .with(rejectRoutingKey);
    }

    @Bean
    public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory){
        RabbitAdmin rabbitAdmin = new RabbitAdmin(connectionFactory);
        rabbitAdmin.setAutoStartup(true);
        return rabbitAdmin;
    }

    @Bean
    public MessageConverter messageConverter(){
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory){
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setExchange(exchangeName);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
