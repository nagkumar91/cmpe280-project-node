import org.testng.annotations.Test;
import org.testng.annotations.Test;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;
import org.testng.annotations.Test;
import com.google.common.base.Function;

import java.awt.AWTException;
import java.awt.Robot;

import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.Test;
import org.openqa.selenium.firefox.FirefoxDriver;

public class SeleniumTests {
	
	
	public static void main(String args[]) throws InterruptedException{
		System.setProperty("webdriver.chrome.driver", "C://Users//Sagar//Downloads//chromedriver_win32//chromedriver.exe");
		WebDriver driver  = new ChromeDriver();
		Actions builder = new Actions(driver);
	        driver.get("http://cmpe280-node.nagkumar.com:3000/");
	        System.out.println("=======Test Case 1 passed : localhost:3000 opened in new Chrome Window=======");
	        try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
	     
        
        /**
         * Calling the Most Visited API
         */
        WebElement most_visited_link = driver.findElement(By.id("mostVisited"));
        Thread.sleep(2000);
        
        Action mouseOvermost_visited_link = builder.moveToElement(most_visited_link).build();
        mouseOvermost_visited_link.perform(); 
        Thread.sleep(2000);
        driver.findElement(By.id("mostVisited")).click();
        Thread.sleep(1000);
        WebElement most_Visited_button = driver.findElement(By.id("datePicked"));
        Action mouse_most_VisitedOverDatePicker = builder.moveToElement(most_Visited_button).build();
        mouse_most_VisitedOverDatePicker.perform(); 
        Thread.sleep(2000);
        driver.findElement(By.id("datePicked")).click();
        Thread.sleep(2000);
        
        driver.findElement(By.linkText("6")).click();
        Thread.sleep(5000);
    
        /**
         * Calling the Status Pie API
         * @param builder 
         * @param driver 
         */
  
        WebElement status_pie_link = driver.findElement(By.id("statusPie"));
        Thread.sleep(2000);
        //Actions builder = new Actions(driver);
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

        /**
         * Calling the Old Data API 
         */
        WebElement old_data_link = driver.findElement(By.id("oldData"));
        Thread.sleep(2000);
       // Actions builder = new Actions(driver);
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
}
