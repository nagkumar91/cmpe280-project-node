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

public class OldData {
  @Test
  public void olddatapage() throws InterruptedException {
	  
	  WebDriver driver  = new ChromeDriver();
		Actions builder = new Actions(driver);
	        driver.get("http://cmpe280-node.nagkumar.com:3000/");
	        //System.out.println("=======Test Case 3 passed : localhost:3000 opened in new Chrome Window=======");
	        try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
      WebElement old_data_link = driver.findElement(By.id("oldData"));
      Thread.sleep(2000);
      Action mouseOverOldData = builder.moveToElement(old_data_link).build();
      mouseOverOldData.perform(); 
      Thread.sleep(2000);
      driver.findElement(By.id("oldData")).click();
      
      Thread.sleep(1000);
      
      WebElement old_data_button = driver.findElement(By.id("datePicked"));
      Action mouseOverDatePicker = builder.moveToElement(old_data_button).build();
      mouseOverDatePicker.perform(); 
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
  }

  @BeforeTest
  public void beforeTest() {
	  System.setProperty("webdriver.chrome.driver", "C://Users//Sagar//Downloads//chromedriver_win32//chromedriver.exe");
  }

  @BeforeSuite
  public void beforeSuite() {
  }

}
