package edu.infosys.farmVerseApplication.aiService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.infosys.farmVerseApplication.bean.FarmCropInputs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpensePredictService {

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.model.id}")
    private String modelId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FarmCropInputs predictResourceExpenses(FarmCropInputs cropInputs) {

        try {

            String prompt = String.format(
                    "You are an agricultural expert system. Based on historical data and crop management standards, calculate the required resources per acre.\n\n"
                            + "INPUT DATA:\n"
                            + "- Crop ID: %s\n"
                            + "- Crop Name: %s\n"
                            + "- Soil Type: %s\n"
                            + "- Sown Time: %s\n"
                            + "- Harvest Time: %s\n"
                            + "- Yield per Acre: %.2f\n\n"
                            + "INSTRUCTION:\n"
                            + "Reply exactly in this format:\n"
                            + "WATER_GALLON: [numeric value]\n"
                            + "FERTILIZER_KG: [numeric value]\n"
                            + "PESTICIDE_KG: [numeric value]\n"
                            + "TRACTOR_HOUR: [integer value]",

                    cropInputs.getCropId(),
                    cropInputs.getCropName(),
                    cropInputs.getSoil(),
                    cropInputs.getSownMonthYear(),
                    cropInputs.getHarvestMonthYear(),
                    cropInputs.getYield());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", modelId);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));

            payload.put("messages", messages);
            payload.put("max_tokens", 300);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(payload, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(apiUrl, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());

            String resultText = root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText()
                    .trim();

            parseAndSetPredictedValues(resultText, cropInputs);

            return cropInputs;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return cropInputs;
        }
    }

    private void parseAndSetPredictedValues(String resultText,
                                            FarmCropInputs cropInputs) {

        String[] lines = resultText.split("\n");

        for (String line : lines) {

            line = line.trim();

            if (line.startsWith("WATER_GALLON:")) {

                String value = line.replace("WATER_GALLON:", "")
                        .replaceAll("[^0-9.]", "")
                        .trim();

                if (!value.isEmpty()) {
                    cropInputs.setWaterGallon(Double.parseDouble(value));
                }

            } else if (line.startsWith("FERTILIZER_KG:")) {

                String value = line.replace("FERTILIZER_KG:", "")
                        .replaceAll("[^0-9.]", "")
                        .trim();

                if (!value.isEmpty()) {
                    cropInputs.setFertilizer(Double.parseDouble(value));
                }

            } else if (line.startsWith("PESTICIDE_KG:")) {

                String value = line.replace("PESTICIDE_KG:", "")
                        .replaceAll("[^0-9.]", "")
                        .trim();

                if (!value.isEmpty()) {
                    cropInputs.setPesticides(Double.parseDouble(value));
                }

            } else if (line.startsWith("TRACTOR_HOUR:")) {

                String value = line.replace("TRACTOR_HOUR:", "")
                        .replaceAll("[^0-9]", "")
                        .trim();

                if (!value.isEmpty()) {
                    cropInputs.setTractorHour(Integer.parseInt(value));
                }
            }
        }
    }
}