package edu.infosys.farmVerseApplication.bean;

import jakarta.persistence.Id;
import jakarta.persistence.Entity;

@Entity
public class Farm {
	@Id
	private Long farmId;
	
	  private String farmName;
	  private Double area;
	  private String soil;
	  private String username;
	  
	  public Farm() {
		  super();
	  }
	  
	  public Farm(Long farmId, String farmName, Double area, String soil, String username) {
			super();
			this.farmId = farmId;
			this.farmName = farmName;
			this.area = area;
			this.soil = soil;
			this.username = username;
		}
	  
	  public String getSoil() {
		return soil;
	}
	  public void setSoil(String soil) {
		  this.soil = soil;
	  }
	  public Long getFarmId() {
		  return farmId;
	  }
	  public void setFarmId(Long farmId) {
		  this.farmId = farmId;
	  }
	  public String getFarmName() {
		  return farmName;
	  }
	  public void setFarmName(String farmName) {
		  this.farmName = farmName;
	  }
	  public Double getArea() {
		  return area;
	  }
	  public void setArea(Double area) {
		  this.area = area;
	  }
	  public String getUsername() {
		  return username;
	  }
	  public void setUsername(String username) {
		  this.username = username;
	  }
	  
	  
}