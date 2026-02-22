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
    @Value("${rabbitmq.queue.cta-service}")
    private String ctaQueue;
    @Value("${rabbitmq.routing-key.new}")
    private String newTaskRoutingKey;
    @Value("${rabbitmq.routing-key.accept}")
    private String acceptTaskRoutingKey;
    @Value("${rabbitmq.routing-key.reject}")
    private String rejectTaskRoutingKey;

    @Bean
    public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
        RabbitAdmin rabbitAdmin = new RabbitAdmin(connectionFactory);
        rabbitAdmin.setAutoStartup(true);
        return rabbitAdmin;
    }

    @Bean
    public TopicExchange topicExchange() {
        return ExchangeBuilder.topicExchange(exchangeName).durable(true).build();
    }

    @Bean
    public Queue ctaQueue() {
        return QueueBuilder.durable(ctaQueue).build();
    }

    @Bean
    public Binding bindCTAAccept() {
        return BindingBuilder.bind(ctaQueue())
                .to(topicExchange())
                .with(acceptTaskRoutingKey);
    }

    @Bean
    public Binding bindCTAReject() {
        return BindingBuilder.bind(ctaQueue())
                .to(topicExchange())
                .with(rejectTaskRoutingKey);
    }

    @Bean
    public Binding bindCTANew() {
        return BindingBuilder.bind(ctaQueue()).to(topicExchange()).with(newTaskRoutingKey);
    }


    @Bean
    public MessageConverter messageConverter(){
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setExchange(exchangeName);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
