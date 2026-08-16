package edu.infosys.farmVerseApplication.bean;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class CropInputs {

    @Id
    private String cropId;
    private Double waterGallon;
    private Double fertilizer;
    private Double pesticides;
    private Integer tractorHour;
    private Double agroTools;

    public CropInputs() {
        super();
    }

        public CropInputs(FarmCropInputs farmCropInputs) {
        super();
        this.cropId = farmCropInputs.getCropId();
        this.waterGallon = farmCropInputs.getWaterGallon();
        this.fertilizer = farmCropInputs.getFertilizer();
        this.pesticides = farmCropInputs.getPesticides();
        this.tractorHour = farmCropInputs.getTractorHour();
        this.agroTools = 0.0;
    }

    public CropInputs(String cropId, Double waterGallon, Double fertilizer,
            Double pesticides, Integer tractorHour, Double agroTools) {
        super();
        this.cropId = cropId;
        this.waterGallon = waterGallon;
        this.fertilizer = fertilizer;
        this.pesticides = pesticides;
        this.tractorHour = tractorHour;
        this.agroTools = agroTools;
    }

    public String getCropId() {
        return cropId;
    }

    public void setCropId(String cropId) {
        this.cropId = cropId;
    }

    public Double getWaterGallon() {
        return waterGallon;
    }

    public void setWaterGallon(Double waterGallon) {
        this.waterGallon = waterGallon;
    }

    public Double getFertilizer() {
        return fertilizer;
    }

    public void setFertilizer(Double fertilizer) {
        this.fertilizer = fertilizer;
    }

    public Double getPesticides() {
        return pesticides;
    }

    public void setPesticides(Double pesticides) {
        this.pesticides = pesticides;
    }

    public Integer getTractorHour() {
        return tractorHour;
    }

    public void setTractorHour(Integer tractorHour) {
        this.tractorHour = tractorHour;
    }

    public Double getAgroTools() {
        return agroTools;
    }

    public void setAgroTools(Double agroTools) {
        this.agroTools = agroTools;
    }
}