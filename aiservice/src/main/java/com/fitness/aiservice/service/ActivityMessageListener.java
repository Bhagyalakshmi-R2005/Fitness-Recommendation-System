package com.fitness.aiservice.service;
import com.fitness.fitness_common.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {
    private final ActivityAIService activityAIService;
    @RabbitListener(queues = "${app.rabbitmq.queue.name:activity.queue}", containerFactory = "rabbitListenerContainerFactory")
    public void processActivity(Activity activity){
        log.info("Received activity for processing: {}", activity.getId());
        String result = activityAIService.generateRecommendation(activity);
        log.info("Generated Recommendation: {}", result);

    }
}
