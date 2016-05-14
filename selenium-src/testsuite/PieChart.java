package testsuite;

import org.testng.annotations.Test;
import org.testng.annotations.BeforeMethod;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.BeforeSuite;

public class PieChart {
  @Test
  public void piechartpage() throws InterruptedException {
	  WebDriver driver  = new ChromeDriver();
		Actions builder = new Actions(driver);
	        driver.get("http://cmpe280-node.nagkumar.com:3000/");
	        try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
	  WebElement status_pie_link = driver.findElement(By.id("statusPie"));
      Thread.sleep(2000);
      Action mouseOverStatusPie = builder.moveToElement(status_pie_link).build();
      mouseOverStatusPie.perform(); 
      Thread.sleep(1000);
      driver.findElement(By.id("statusPie")).click();
      Thread.sleep(1000);
      
      WebElement status_pie_button = driver.findElement(By.id("datePicked"));
      Action mouseOver_Status_pie_DatePicker = builder.moveToElement(status_pie_button).build();
      mouseOver_Status_pie_DatePicker.perform(); 
      Thread.sleep(2000);
      driver.findElement(By.id("datePicked")).click();
      Thread.sleep(2000);
      driver.findElement(By.linkText("6")).click();
      Thread.sleep(5000);
      driver.quit();
	  
  }
  @BeforeMethod
  public void beforeMethod() {
  }

  @BeforeClass
  public void beforeClass() {
	  System.setProperty("webdriver.chrome.driver", "C://Users//Sagar//Downloads//chromedriver_win32//chromedriver.exe");
  }

  @BeforeTest
  public void beforeTest() {
  }

  @BeforeSuite
  public void beforeSuite() {
  }

}
