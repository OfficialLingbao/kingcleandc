const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Newsletter endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://us14.api.mailchimp.com/3.0/lists/3b83b2a4a1/members',
            auth: {
                username: 'anystring',
                password: '8c0e46b1f2ebfb776e7d9f1217994198-us14'
            },
            data: {
                email_address: email,
                status: 'subscribed'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Mailchimp API Error:', error.response?.data || error.message);
        
        // Handle specific Mailchimp errors
        if (error.response?.data) {
            if (error.response.data.title === 'Member Exists') {
                return res.status(400).json({ 
                    message: 'This email is already subscribed to our newsletter.' 
                });
            }
            return res.status(400).json({ 
                message: error.response.data.detail || 'Failed to subscribe to newsletter.' 
            });
        }

        res.status(500).json({ 
            message: 'An error occurred while subscribing to the newsletter.' 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
