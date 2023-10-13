client.on("interactionCreate", async (interaction) => {
  if (interaction.commandName === "ticket") {
    const cre = new Discord.MessageButton()
      .setCustomId("create")
      .setStyle("PRIMARY")
      .setLabel("チケットを作成する");
    const embed1 = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription("チケットを作成するには下のボタンを押してください");
    await interaction.reply({
      embeds: [embed1],
      components: [new Discord.MessageActionRow().addComponents(cre)],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.customId === "create") {
  const mid = interaction.user.id;
    if (interaction.guild.channels.cache.find((tic) => tic.name === `チケット-${mid}`))
      return await interaction.reply({
        content: `既に作成済です\nhttps://discord.com/channels/${
          interaction.guild.id
        }/${
          interaction.guild.channels.cache.find((tic) => tic.name === `チケット-${mid}`)
            .id
        }`,
        ephemeral: true,
      });
    await interaction.guild.channels
      .create(`チケット-${mid}`, {
        reason: `Created By : ${interaction.user.username}`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: interaction.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES","READ_MESSAGE_HISTORY"],
          },
          {
            id: client.user.id,
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
          },
        ],
      })
    await interaction.reply({
      content: `作成しました\nhttps://discord.com/channels/${interaction.guild.id}/${interaction.guild.channels.cache.find((tic) => tic.name === `チケット-${mid}`).id }`,
      ephemeral: true,
    });
    const embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription(
        "チケットを作成しました。削除する場合は下のボタンを押してください"
      );
    const del = new Discord.MessageButton()
      .setCustomId("delete")
      .setStyle("DANGER")
      .setLabel("削除");
    await interaction.guild.channels.cache
      .find((ch) => ch.name === `チケット-${mid}`)
      .send({
        embeds: [embed],
        components: [new Discord.MessageActionRow().addComponents(del)],
      });
  }

  if (interaction.customId === "delete") {
    await interaction.guild.channels
      .delete(`${interaction.channel.id}`)
  }
});
