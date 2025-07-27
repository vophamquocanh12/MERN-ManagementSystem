export const generateEmailTemplate = ({ title, message, buttonText, buttonLink }) => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #1e40af;">${title}</h2>
        <p style="font-size: 16px; color: #333;">${message}</p>
  
        ${
          buttonText && buttonLink
            ? `<a href="${buttonLink}" style="display: inline-block; margin-top: 20px; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">${buttonText}</a>`
            : ""
        }
  
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #999;">This message was sent by EMS System. Do not reply.</p>
      </div>
    </div>
    `;
  };
  