package com.fitness.aiservice.config;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class RabbitMqConfig {

    @Value("${app.rabbitmq.queue.name:activity.queue}")
    private String queue;
    @Value("${app.rabbitmq.exchange.name:fitness.exchange}")
    private String exchange;
    @Value("${app.rabbitmq.routing.key:activity.tracking}")
    private String routingKey;
    @Bean
    public Queue activityQueue() {
        return new Queue(queue, true);
    }
    @Bean
    public DirectExchange activityExchange(){
        return new DirectExchange(exchange);
    }
    @Bean
    public Binding activityBinding(Queue activityQueue, DirectExchange activityExchange){
        return  BindingBuilder.bind(activityQueue).to(activityExchange).with(routingKey);
    }
    @Bean
    public MessageConverter jsonMessageConverter(){
        return new Jackson2JsonMessageConverter();
    }
}

